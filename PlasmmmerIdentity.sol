// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// ╔══════════════════════════════════════════════════════════════════════════╗
// ║   PLASMMER IDENTITY CONTRACTS — MOCK / REFERÊNCIA DE DESIGN             ║
// ║                                                                          ║
// ║   Cada seção deste arquivo corresponde a uma seção da SettingsPage.jsx  ║
// ║   Os comentários explicam qual botão/toggle/ação dispara cada função    ║
// ║                                                                          ║
// ║   CONTRATOS:                                                             ║
// ║   1. PlasmmmerIdentity   — Identity & Profile (seção "identity")        ║
// ║   2. PlasmmmerACL        — Privacy, Connected Apps (seção "privacy")    ║
// ║   3. SocialRecovery      — Social Recovery (seção "recovery")           ║
// ║   4. DAOMembership       — DAO Memberships (seção "dao")                ║
// ║   5. PlasmmmerAlerts     — On-chain Alerts (seção "alerts")             ║
// ║   6. DataSovereignty     — Data Sovereignty (seção "data")              ║
// ║                                                                          ║
// ║   ⚠️  Este é um MOCK de design — não usar em produção sem auditoria    ║
// ╚══════════════════════════════════════════════════════════════════════════╝


// ════════════════════════════════════════════════════════════════════════════
// 🪪  CONTRATO 1: PlasmmmerIdentity
//     Corresponde à seção "Identity & Profile" na SettingsPage
// ════════════════════════════════════════════════════════════════════════════

contract PlasmmmerIdentity {

    // ── Structs ──────────────────────────────────────────────────────────

    struct Profile {
        string did;           // DID Bluesky — imutável após registro
        string handle;        // handle Bluesky (@perla.bsky.social)
        string displayName;   // nome editável — alterado por updateProfile()
        string ensName;       // ENS associado — alterado por updateProfile()
        string avatarCID;     // CID IPFS do avatar — sincronizado do Bluesky
        uint256 registeredAt; // timestamp do primeiro registro
        bool    exists;       // sentinel de existência
    }

    // ── Storage ───────────────────────────────────────────────────────────

    // ETH address → Profile completo
    mapping(address => Profile) private profiles;

    // DID → ETH address (lookup reverso, pra resolver DID → wallet)
    mapping(string => address) private didToAddress;

    // ETH address → bool (blacklist de identidades queimadas/transferidas)
    mapping(address => bool) private burned;

    // Guarda pra quem a identidade foi transferida (só 1 transferência permitida)
    mapping(address => address) private transferredTo;

    // ── Eventos ───────────────────────────────────────────────────────────

    event ProfileRegistered(address indexed owner, string did, uint256 timestamp);
    // ↑ disparado quando user faz login pela primeira vez via Bluesky OAuth

    event ProfileUpdated(address indexed owner, string displayName, string ensName);
    // ↑ disparado quando user clica "Salvar alterações" em Identity Settings
    //   (botão btn-primary na seção identity da SettingsPage)

    event AvatarUpdated(address indexed owner, string newCID);
    // ↑ disparado quando user clica "Sincronizar do Bluesky"

    event IdentityTransferred(address indexed from, address indexed to, string did);
    // ↑ disparado pelo botão "Confirmar Transferência" na Danger Zone
    //   — só pode acontecer UMA VEZ por endereço (transferredTo guard)

    event IdentityBurned(address indexed owner, string did);
    // ↑ disparado pelo botão "Apagar identidade para sempre" na Danger Zone
    //   — requer confirmação "APAGAR MINHA IDENTIDADE" no input

    // ── Modifiers ─────────────────────────────────────────────────────────

    modifier onlyOwner() {
        require(profiles[msg.sender].exists, "Perfil nao encontrado");
        require(!burned[msg.sender],         "Identidade queimada");
        _;
    }

    modifier notTransferred() {
        require(transferredTo[msg.sender] == address(0), "Identidade ja transferida");
        _;
    }

    // ── Funções de leitura ────────────────────────────────────────────────

    /// @notice Retorna o perfil completo de um endereço
    /// @dev Usado pelo frontend em /api/session para hidratar o perfil pós-login
    function getProfile(address owner) external view returns (Profile memory) {
        require(profiles[owner].exists, "Perfil nao encontrado");
        return profiles[owner];
    }

    /// @notice Resolve DID → endereço ETH
    /// @dev Usado pelo WaaP após callback Bluesky pra verificar se DID já tem wallet
    function resolveAddress(string calldata did) external view returns (address) {
        return didToAddress[did];
    }

    // ── Funções de escrita ────────────────────────────────────────────────

    /// @notice Registra um novo perfil Plasmmer
    /// @dev Chamado automaticamente no primeiro login via /api/auth/callback
    ///      O DID vem do AT Protocol, o endereço é a wallet derivada pelo WaaP
    function register(
        string calldata did,
        string calldata handle,
        string calldata displayName,
        string calldata avatarCID
    ) external {
        require(!profiles[msg.sender].exists,   "Perfil ja existe");
        require(didToAddress[did] == address(0), "DID ja registrado");
        require(bytes(did).length > 0,           "DID invalido");

        profiles[msg.sender] = Profile({
            did:          did,
            handle:       handle,
            displayName:  displayName,
            ensName:      "",
            avatarCID:    avatarCID,
            registeredAt: block.timestamp,
            exists:       true
        });

        didToAddress[did] = msg.sender;

        emit ProfileRegistered(msg.sender, did, block.timestamp);
    }

    /// @notice Atualiza displayName e ENS
    /// @dev UI: botão "Salvar alterações" na seção Identity Settings
    ///      Limita displayName a 32 chars para caber em storage eficiente
    function updateProfile(
        string calldata displayName,
        string calldata ensName
    ) external onlyOwner {
        require(bytes(displayName).length > 0,   "displayName vazio");
        require(bytes(displayName).length <= 32, "displayName muito longo");

        profiles[msg.sender].displayName = displayName;
        profiles[msg.sender].ensName     = ensName;

        emit ProfileUpdated(msg.sender, displayName, ensName);
    }

    /// @notice Sincroniza avatar do Bluesky (salva novo CID IPFS)
    /// @dev UI: botão "Sincronizar do Bluesky" na seção Identity Settings
    function updateAvatar(string calldata newCID) external onlyOwner {
        require(bytes(newCID).length > 0, "CID invalido");
        profiles[msg.sender].avatarCID = newCID;
        emit AvatarUpdated(msg.sender, newCID);
    }

    // ── Danger Zone: Transferência ────────────────────────────────────────

    /// @notice Transfere a identidade Plasmmer para outro endereço
    /// @dev UI: botão "Confirmar Transferência" na Danger Zone
    ///      - Só pode ser chamado UMA VEZ por endereço (notTransferred guard)
    ///      - O endereço de destino não pode ter um perfil existente
    ///      - O endereço de origem fica marcado como "burned" após transferência
    function transferIdentity(address to) external onlyOwner notTransferred {
        require(to != address(0),           "Endereco invalido");
        require(to != msg.sender,           "Nao pode transferir pra si mesmo");
        require(!profiles[to].exists,       "Destino ja tem identidade");
        require(!burned[to],                "Destino queimado");

        // Move o perfil
        Profile memory profile = profiles[msg.sender];
        profiles[to]           = profile;
        profiles[msg.sender]   = Profile("","","","","",0,false);

        // Atualiza lookup reverso do DID
        didToAddress[profile.did] = to;

        // Marca origem como transferida (impede nova transferência)
        transferredTo[msg.sender] = to;
        burned[msg.sender]        = true;

        emit IdentityTransferred(msg.sender, to, profile.did);
    }

    // ── Danger Zone: Queima ───────────────────────────────────────────────

    /// @notice Destrói permanentemente a identidade Plasmmer
    /// @dev UI: botão "Apagar identidade para sempre" na Danger Zone
    ///      - Irreversível — não há função de "unburn"
    ///      - O DID fica liberado no lookup (outra conta pode re-registrar)
    ///      - A wallet ETH continua existindo, só o vínculo DID↔ETH é destruído
    function burnIdentity() external onlyOwner {
        string memory did = profiles[msg.sender].did;

        delete profiles[msg.sender];
        delete didToAddress[did];
        burned[msg.sender] = true;

        emit IdentityBurned(msg.sender, did);
    }
}


// ════════════════════════════════════════════════════════════════════════════
// 🛡️  CONTRATO 2: PlasmmmerACL
//     Corresponde às seções "Privacy & ACL" e "Connected Apps" na SettingsPage
// ════════════════════════════════════════════════════════════════════════════

contract PlasmmmerACL {

    // ── Enums ─────────────────────────────────────────────────────────────

    /// @dev UI: radio group de visibilidade na seção Privacy
    enum Visibility { Public, Followers, Private }

    // ── Structs ──────────────────────────────────────────────────────────

    struct AppPermission {
        address appContract; // endereço do contrato do app
        string  appName;     // nome legível (ex: "Gamlr")
        string[] scopes;     // escopos permitidos (ex: ["read_profile","create_post"])
        uint256 grantedAt;   // timestamp da aprovação
        bool    active;      // se a permissão ainda está ativa
    }

    // ── Storage ───────────────────────────────────────────────────────────

    // owner → Visibility
    mapping(address => Visibility) public profileVisibility;

    // owner → endereços bloqueados
    mapping(address => mapping(address => bool)) public blocklist;

    // owner → se modo allowlist está ativo
    mapping(address => bool) public allowlistMode;

    // owner → endereços na allowlist
    mapping(address => mapping(address => bool)) public allowlist;

    // owner → compartilhar dados com DAOs
    mapping(address => bool) public shareWithDAOs;

    // owner → lista de permissões de apps (appId → AppPermission)
    mapping(address => mapping(uint256 => AppPermission)) public appPermissions;

    // owner → contador de apps
    mapping(address => uint256) public appCount;

    // ── Eventos ───────────────────────────────────────────────────────────

    event VisibilityChanged(address indexed owner, Visibility newVisibility);
    // ↑ UI: radio group "Visibilidade do perfil" → qualquer opção selecionada

    event AddressBlocked(address indexed owner, address indexed blocked);
    event AddressUnblocked(address indexed owner, address indexed unblocked);
    // ↑ UI: botão "Gerenciar blocklist" → ações de bloquear/desbloquear

    event AllowlistModeToggled(address indexed owner, bool enabled);
    // ↑ UI: toggle "Modo allowlist" na seção Privacy

    event DataSharingToggled(address indexed owner, bool enabled);
    // ↑ UI: toggle "Compartilhar dados com DAOs" na seção Privacy

    event AppPermissionGranted(address indexed owner, uint256 appId, string appName);
    // ↑ UI: quando um app solicita conexão (fluxo OAuth de app)

    event AppPermissionRevoked(address indexed owner, uint256 appId, string appName);
    // ↑ UI: botão "Revogar" na linha de cada app na seção "Connected Apps"

    // ── Funções de Privacy ────────────────────────────────────────────────

    /// @notice Define visibilidade do perfil
    /// @dev UI: radio group Público / Seguidores / Privado na seção Privacy
    function setVisibility(Visibility visibility) external {
        profileVisibility[msg.sender] = visibility;
        emit VisibilityChanged(msg.sender, visibility);
    }

    /// @notice Bloqueia um endereço
    /// @dev UI: botão "Gerenciar blocklist" → adicionar endereço
    function blockAddress(address target) external {
        require(target != msg.sender, "Nao pode bloquear a si mesmo");
        blocklist[msg.sender][target] = true;
        emit AddressBlocked(msg.sender, target);
    }

    /// @notice Desbloqueia um endereço
    function unblockAddress(address target) external {
        blocklist[msg.sender][target] = false;
        emit AddressUnblocked(msg.sender, target);
    }

    /// @notice Ativa/desativa modo allowlist
    /// @dev UI: toggle "Modo allowlist" na seção Privacy
    function toggleAllowlist(bool enabled) external {
        allowlistMode[msg.sender] = enabled;
        emit AllowlistModeToggled(msg.sender, enabled);
    }

    /// @notice Ativa/desativa compartilhamento de dados com DAOs
    /// @dev UI: toggle "Compartilhar dados com DAOs" na seção Privacy
    function toggleDataSharing(bool enabled) external {
        shareWithDAOs[msg.sender] = enabled;
        emit DataSharingToggled(msg.sender, enabled);
    }

    // ── Funções de Apps ───────────────────────────────────────────────────

    /// @notice Revoga permissão de um app
    /// @dev UI: botão "Revogar" na linha do app na seção "Connected Apps"
    ///      O appId corresponde ao índice na lista de apps do usuário
    function revokeAppPermission(uint256 appId) external {
        AppPermission storage app = appPermissions[msg.sender][appId];
        require(app.active, "Permissao ja revogada");

        string memory name = app.appName;
        app.active = false;

        emit AppPermissionRevoked(msg.sender, appId, name);
    }

    /// @notice Concede permissão a um app (chamado pelo app via OAuth)
    /// @dev Chamado pelo backend do app após user autorizar
    function grantAppPermission(
        address owner,
        address appContract,
        string calldata appName,
        string[] calldata scopes
    ) external returns (uint256 appId) {
        // Em produção: verificar assinatura do owner pra evitar grants não autorizados
        appId = appCount[owner]++;
        appPermissions[owner][appId] = AppPermission({
            appContract: appContract,
            appName:     appName,
            scopes:      scopes,
            grantedAt:   block.timestamp,
            active:      true
        });

        emit AppPermissionGranted(owner, appId, appName);
    }

    // ── Verificação de acesso ─────────────────────────────────────────────

    /// @notice Verifica se `viewer` pode ver o perfil de `owner`
    /// @dev Chamado por qualquer dApp que queira acessar dados de um perfil
    function canView(address owner, address viewer) external view returns (bool) {
        if (viewer == owner) return true;
        if (blocklist[owner][viewer]) return false;

        Visibility vis = profileVisibility[owner];
        if (vis == Visibility.Public)    return true;
        if (vis == Visibility.Private)   return false;

        // Visibility.Followers: em produção, verificar no contrato de social graph
        if (allowlistMode[owner]) return allowlist[owner][viewer];
        return true;
    }
}


// ════════════════════════════════════════════════════════════════════════════
// 👥  CONTRATO 3: SocialRecovery
//     Corresponde à seção "Social Recovery" na SettingsPage
// ════════════════════════════════════════════════════════════════════════════

contract SocialRecovery {

    uint256 public constant MAX_GUARDIANS = 5;

    struct RecoveryRequest {
        address    newOwner;        // endereço para o qual recuperar
        uint256    approvalCount;   // quantos guardiões já aprovaram
        uint256    initiatedAt;     // timestamp do início
        bool       executed;        // se já foi executada
        mapping(address => bool) approved; // quais guardiões aprovaram
    }

    mapping(address => address[]) public guardians;
    // ↑ owner → lista de guardiões (configurados na seção Social Recovery)

    mapping(address => uint256) public threshold;
    // ↑ owner → quórum mínimo (slider na seção Social Recovery)

    mapping(address => RecoveryRequest) public recoveryRequests;
    // ↑ owner → pedido de recuperação em andamento

    // ── Eventos ───────────────────────────────────────────────────────────

    event GuardianAdded(address indexed owner, address indexed guardian);
    // ↑ UI: botão "+ Adicionar guardião" na seção Social Recovery

    event GuardianRemoved(address indexed owner, address indexed guardian);
    // ↑ UI: ícone de lixeira em cada guardião da lista

    event ThresholdUpdated(address indexed owner, uint256 newThreshold);
    // ↑ UI: slider de quórum "Quórum mínimo: N guardiões"

    event RecoveryInitiated(address indexed owner, address indexed newOwner);
    // ↑ disparado quando um guardião inicia pedido de recuperação
    //   (não tem UI direta — é o guardião que age externamente)

    event RecoveryApproved(address indexed owner, address indexed guardian);
    // ↑ UI no lado do guardião (fora desta página)

    event RecoveryExecuted(address indexed oldOwner, address indexed newOwner);
    // ↑ disparado automaticamente quando quórum é atingido
    //   — alerta mostrado via On-chain Alerts (event guardian_request)

    // ── Funções de configuração ───────────────────────────────────────────

    /// @notice Adiciona um guardião
    /// @dev UI: botão "+ Adicionar guardião"
    ///      O guardião recebe um convite e deve confirmar no contrato
    function addGuardian(address guardian) external {
        require(guardian != msg.sender,                  "Nao pode ser guardiao de si mesmo");
        require(guardians[msg.sender].length < MAX_GUARDIANS, "Maximo de guardioes atingido");

        // Verifica se já é guardião
        for (uint i = 0; i < guardians[msg.sender].length; i++) {
            require(guardians[msg.sender][i] != guardian, "Ja e guardiao");
        }

        guardians[msg.sender].push(guardian);
        emit GuardianAdded(msg.sender, guardian);
    }

    /// @notice Remove um guardião
    /// @dev UI: ícone de lixeira ao lado de cada guardião na lista
    function removeGuardian(address guardian) external {
        address[] storage gs = guardians[msg.sender];
        for (uint i = 0; i < gs.length; i++) {
            if (gs[i] == guardian) {
                gs[i] = gs[gs.length - 1];
                gs.pop();
                // Garante que o threshold não fique maior que o nº de guardiões
                if (threshold[msg.sender] > gs.length) {
                    threshold[msg.sender] = gs.length;
                }
                emit GuardianRemoved(msg.sender, guardian);
                return;
            }
        }
        revert("Guardiao nao encontrado");
    }

    /// @notice Define o quórum mínimo
    /// @dev UI: slider de quórum na seção Social Recovery
    ///      — gera tx on-chain quando o usuário solta o slider e confirma
    function setThreshold(uint256 newThreshold) external {
        require(newThreshold >= 1,                       "Minimo 1 guardiao");
        require(newThreshold <= guardians[msg.sender].length, "Threshold maior que guardioes");
        threshold[msg.sender] = newThreshold;
        emit ThresholdUpdated(msg.sender, newThreshold);
    }

    // ── Fluxo de recuperação ──────────────────────────────────────────────

    /// @notice Guardião inicia pedido de recuperação
    function initiateRecovery(address lostOwner, address newOwner) external {
        require(_isGuardian(lostOwner, msg.sender), "Nao e guardiao");
        RecoveryRequest storage req = recoveryRequests[lostOwner];
        require(!req.executed, "Recuperacao ja executada");

        req.newOwner    = newOwner;
        req.initiatedAt = block.timestamp;
        req.approved[msg.sender] = true;
        req.approvalCount = 1;

        emit RecoveryInitiated(lostOwner, newOwner);
    }

    /// @notice Guardião aprova pedido de recuperação
    /// @dev Quando approvalCount >= threshold, executa automaticamente
    function approveRecovery(address lostOwner) external {
        require(_isGuardian(lostOwner, msg.sender), "Nao e guardiao");

        RecoveryRequest storage req = recoveryRequests[lostOwner];
        require(!req.executed,                    "Ja executada");
        require(!req.approved[msg.sender],         "Ja aprovou");

        req.approved[msg.sender] = true;
        req.approvalCount++;

        emit RecoveryApproved(lostOwner, msg.sender);

        // Executa automaticamente se quórum atingido
        if (req.approvalCount >= threshold[lostOwner]) {
            req.executed = true;
            // Em produção: chamar PlasmmmerIdentity.transferIdentity() aqui
            // via delegatecall ou proxy autorizado
            emit RecoveryExecuted(lostOwner, req.newOwner);
        }
    }

    /// @dev Verifica se um endereço é guardião de outro
    function _isGuardian(address owner, address candidate) internal view returns (bool) {
        address[] storage gs = guardians[owner];
        for (uint i = 0; i < gs.length; i++) {
            if (gs[i] == candidate) return true;
        }
        return false;
    }
}


// ════════════════════════════════════════════════════════════════════════════
// 🏛️  CONTRATO 4: DAOMembership
//     Corresponde à seção "DAO Memberships" na SettingsPage
// ════════════════════════════════════════════════════════════════════════════

contract DAOMembership {

    struct Membership {
        string  daoId;         // ex: "plasmmer", "floflis", "gamlr"
        string  role;          // ex: "Core Member", "Member", "Observer"
        uint256 votingPower;   // número de votos disponíveis
        uint256 joinedAt;      // timestamp de ingresso
        bool    active;        // se a membership está ativa
        address delegate;      // endereço para quem o voto foi delegado (0x0 = ninguém)
    }

    // owner → daoId → Membership
    mapping(address => mapping(string => Membership)) public memberships;

    // ── Eventos ───────────────────────────────────────────────────────────

    event VoteDelegated(address indexed owner, string daoId, address indexed to);
    // ↑ UI: botão "Configurar delegação" na seção DAO Memberships

    event DelegationRevoked(address indexed owner, string daoId);
    // ↑ UI: revogar delegação ativa

    event MembershipDeactivated(address indexed owner, string daoId);
    // ↑ UI: toggle "ativa/inativa" no status da DAO

    // ── Funções ───────────────────────────────────────────────────────────

    /// @notice Delega votos de uma DAO para outro endereço
    /// @dev UI: botão "Configurar delegação" — abre modal com campo de endereço
    function delegateVotes(string calldata daoId, address to) external {
        Membership storage m = memberships[msg.sender][daoId];
        require(m.active,          "Membership inativa");
        require(to != msg.sender,  "Nao pode delegar pra si mesmo");
        require(to != address(0),  "Endereco invalido");

        m.delegate = to;
        emit VoteDelegated(msg.sender, daoId, to);
    }

    /// @notice Revoga delegação de votos
    function revokeDelegation(string calldata daoId) external {
        Membership storage m = memberships[msg.sender][daoId];
        require(m.delegate != address(0), "Sem delegacao ativa");

        m.delegate = address(0);
        emit DelegationRevoked(msg.sender, daoId);
    }

    /// @notice Consulta poder de voto efetivo (considera delegações recebidas)
    function effectiveVotingPower(address voter, string calldata daoId) external view returns (uint256 power) {
        Membership storage own = memberships[voter][daoId];
        if (own.active && own.delegate == address(0)) {
            power = own.votingPower;
        }
        // Em produção: somar votos delegados ao voter por outros membros
        // via indexação off-chain no The Graph
    }
}


// ════════════════════════════════════════════════════════════════════════════
// 🔔  CONTRATO 5: PlasmmmerAlerts
//     Corresponde à seção "On-chain Alerts" na SettingsPage
// ════════════════════════════════════════════════════════════════════════════

contract PlasmmmerAlerts {

    // Enum dos tipos de alerta disponíveis na UI
    // (cada item = uma linha na lista de toggles da seção Alerts)
    enum AlertType {
        IncomingTx,      // "Transação recebida"
        DAOProposal,     // "Nova proposta em DAO"
        GuardianRequest, // "Pedido de Social Recovery"
        AppPermission,   // "App solicitou permissão"
        ACLChange,       // "Mudança de privacidade"
        OutgoingTx       // "Transação enviada"
    }

    // owner → AlertType → enabled
    mapping(address => mapping(uint8 => bool)) public alertPrefs;

    // ── Eventos ───────────────────────────────────────────────────────────

    event AlertPrefsUpdated(address indexed owner, uint8 alertType, bool enabled);
    // ↑ UI: toggle de cada linha na seção "On-chain Alerts"
    //   O The Graph indexa este evento para entregar notificações via webhook

    // ── Funções ───────────────────────────────────────────────────────────

    /// @notice Atualiza preferência de um tipo de alerta
    /// @dev UI: toggle na linha de cada alerta
    ///      alertType é o índice do enum AlertType (0-5)
    function setAlertPref(uint8 alertType, bool enabled) external {
        require(alertType <= uint8(AlertType.OutgoingTx), "Tipo invalido");
        alertPrefs[msg.sender][alertType] = enabled;
        emit AlertPrefsUpdated(msg.sender, alertType, enabled);
    }

    /// @notice Atualiza múltiplos alertas de uma vez (economiza gas)
    /// @dev UI: bouton "Salvar todos" se implementado no futuro
    function setBatchAlertPrefs(uint8[] calldata types, bool[] calldata states) external {
        require(types.length == states.length, "Arrays desiguais");
        for (uint i = 0; i < types.length; i++) {
            require(types[i] <= uint8(AlertType.OutgoingTx), "Tipo invalido");
            alertPrefs[msg.sender][types[i]] = states[i];
            emit AlertPrefsUpdated(msg.sender, types[i], states[i]);
        }
    }

    /// @notice Retorna todas as preferências de uma vez
    function getAllPrefs(address owner) external view returns (bool[6] memory prefs) {
        for (uint8 i = 0; i < 6; i++) {
            prefs[i] = alertPrefs[owner][i];
        }
    }
}


// ════════════════════════════════════════════════════════════════════════════
// 📦  CONTRATO 6: DataSovereignty
//     Corresponde à seção "Data Sovereignty" na SettingsPage
// ════════════════════════════════════════════════════════════════════════════

contract DataSovereignty {

    struct DataRecord {
        string ipfsCID;         // CID IPFS do snapshot de dados exportável
        string ceramicStreamId; // ID do stream Ceramic com dados mutáveis
        uint256 lastUpdated;    // última atualização
        bool    backupEnabled;  // replicação em nós IPFS adicionais
    }

    // owner → DataRecord
    mapping(address => DataRecord) public dataRecords;

    // owner → appId → bool (app tem acesso ao Ceramic stream?)
    mapping(address => mapping(uint256 => bool)) public ceramicAccess;

    // ── Eventos ───────────────────────────────────────────────────────────

    event CIDUpdated(address indexed owner, string newCID);
    // ↑ disparado automaticamente quando dados são exportados/atualizados

    event CeramicStreamLinked(address indexed owner, string streamId);
    // ↑ disparado no primeiro link do Ceramic stream ao perfil

    event CeramicAccessRevoked(address indexed owner, uint256 appId);
    // ↑ UI: botão "Gerenciar acessos" → revogar acesso de app específico

    event BackupToggled(address indexed owner, bool enabled);
    // ↑ UI: toggle "Replicação de backup" na seção Data Sovereignty

    // ── Funções ───────────────────────────────────────────────────────────

    /// @notice Atualiza o CID IPFS do snapshot de dados
    /// @dev Chamado automaticamente pelo backend quando user clica "Exportar"
    ///      O CID ficará visível na row "CID IPFS do seu perfil"
    function updateCID(string calldata newCID) external {
        require(bytes(newCID).length > 0, "CID invalido");
        dataRecords[msg.sender].ipfsCID     = newCID;
        dataRecords[msg.sender].lastUpdated = block.timestamp;
        emit CIDUpdated(msg.sender, newCID);
    }

    /// @notice Linka um Ceramic Stream ao perfil
    /// @dev Chamado no primeiro setup — o streamId fica visível na row "Ceramic Stream ID"
    function linkCeramicStream(string calldata streamId) external {
        require(bytes(streamId).length > 0, "StreamId invalido");
        dataRecords[msg.sender].ceramicStreamId = streamId;
        emit CeramicStreamLinked(msg.sender, streamId);
    }

    /// @notice Revoga acesso de um app ao Ceramic stream
    /// @dev UI: botão "Gerenciar acessos" → revogar app específico
    function revokeCeramicAccess(uint256 appId) external {
        require(ceramicAccess[msg.sender][appId], "App sem acesso");
        ceramicAccess[msg.sender][appId] = false;
        emit CeramicAccessRevoked(msg.sender, appId);
    }

    /// @notice Ativa/desativa backup em nós IPFS adicionais
    /// @dev UI: toggle "Replicação de backup" na seção Data Sovereignty
    function toggleBackup(bool enabled) external {
        dataRecords[msg.sender].backupEnabled = enabled;
        emit BackupToggled(msg.sender, enabled);
    }
}


// ════════════════════════════════════════════════════════════════════════════
// 🗺️  MAPA: UI ↔ Contrato ↔ Evento
//
//  Seção Settings          Ação na UI                  Contrato.função()                    Evento emitido
//  ─────────────────────── ─────────────────────────── ──────────────────────────────────── ─────────────────────────
//  Identity                Salvar alterações            PlasmmmerIdentity.updateProfile()    ProfileUpdated
//  Identity                Sincronizar avatar           PlasmmmerIdentity.updateAvatar()     AvatarUpdated
//  Privacy                 Radio Público/Seguid./Priv.  PlasmmmerACL.setVisibility()         VisibilityChanged
//  Privacy                 Toggle Allowlist             PlasmmmerACL.toggleAllowlist()       AllowlistModeToggled
//  Privacy                 Toggle Compartilhar DAOs     PlasmmmerACL.toggleDataSharing()     DataSharingToggled
//  Privacy                 Gerenciar blocklist          PlasmmmerACL.blockAddress()          AddressBlocked
//  Connected Apps          Revogar app                  PlasmmmerACL.revokeAppPermission()   AppPermissionRevoked
//  Social Recovery         + Adicionar guardião         SocialRecovery.addGuardian()         GuardianAdded
//  Social Recovery         Lixeira (remover guardião)   SocialRecovery.removeGuardian()      GuardianRemoved
//  Social Recovery         Slider quórum                SocialRecovery.setThreshold()        ThresholdUpdated
//  DAO Memberships         Configurar delegação         DAOMembership.delegateVotes()        VoteDelegated
//  On-chain Alerts         Toggle de cada alerta        PlasmmmerAlerts.setAlertPref()       AlertPrefsUpdated
//  Data Sovereignty        Toggle Backup IPFS           DataSovereignty.toggleBackup()       BackupToggled
//  Data Sovereignty        Gerenciar acessos Ceramic    DataSovereignty.revokeCeramicAccess() CeramicAccessRevoked
//  Danger Zone             Confirmar Transferência      PlasmmmerIdentity.transferIdentity() IdentityTransferred
//  Danger Zone             Apagar identidade            PlasmmmerIdentity.burnIdentity()     IdentityBurned
// ════════════════════════════════════════════════════════════════════════════
