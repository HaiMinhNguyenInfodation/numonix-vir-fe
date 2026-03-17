Now read the mermaid structure below 

sequenceDiagram
    participant Parent as Parent App<br/>(localhost:3000)
    participant Server as Auth Bridge API<br/>(Backend)
    participant Iframe as Iframe App<br/>(localhost:4300)

    Note over Parent,Iframe: Phase 1: Parent creates auth session
    
    Parent->>Server: POST /api/session<br/>Headers: Content-Type: application/json, API Key <br/>Body: {token, provider, expiresIn}
    Server->>Server: Validate token format/structure
    Server->>Server: Generate unique sessionId (UUID)
    Server->>Server: Store session data with TTL
    Server-->>Parent: 200 OK<br/>{sessionId, expiresAt}

    Note over Parent,Iframe: Phase 2: Parent loads iframe
    
    Parent->>Iframe: Create iframe with src="http://localhost:4300"
    Iframe-->>Iframe: Iframe loads and initializes

    Note over Parent,Iframe: Phase 3: Parent sends sessionId to iframe
    
    Parent->>Iframe: postMessage({<br/>  type: 'AUTH_SESSION_READY',<br/>  sessionId,<br/>  provider,<br/>  timestamp<br/>}, 'http://localhost:4300')
    Iframe->>Iframe: Validate event.origin === 'http://localhost:3000'

    Note over Parent,Iframe: Phase 4: Iframe retrieves token
    
    Iframe->>Server: GET /api/session/{sessionId}
    Server->>Server: Lookup sessionId in storage
    Server->>Server: Check expiry & validity
    Server-->>Iframe: 200 OK<br/>{token, provider, expiresAt}
    Server->>Server: Optional: Mark session as used/consumed

    Note over Parent,Iframe: Phase 5: Iframe uses token
    
    Iframe->>Iframe: Store token securely<br/>(localStorage/sessionStorage)
    Iframe->>Iframe: Initialize app with authentication
    Iframe->>Server: API calls with Bearer token

    Note over Parent,Iframe: Phase 6: Cleanup (optional)
    
    Server->>Server: Auto-expiry after TTL<br/>(Redis TTL or setTimeout)
    alt Session expired/invalid
        Iframe->>Server: GET /api/auth-bridge/session/{sessionId}
        Server-->>Iframe: 404/410 Session expired
        Iframe->>Iframe: Handle error<br/>(redirect to login)
    end


And make the plan as parent App 
