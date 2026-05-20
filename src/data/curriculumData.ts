import { CurriculumPhase, OverviewData } from '../types';

export const overviewData: OverviewData = {
  title: "Systems Engineering: First Principles Curriculum",
  description: "This curriculum is designed as a single execution-focused learning system. You will build the core data infrastructure for 'AeroParts', a synthetic precision manufacturing company. You will start with local machine logs on your Fedora workstation, move them to a structured database, build an API, and finally integrate with your headless Ubuntu ERPNext server. No concepts are discarded; every layer builds on the physical reality of the layer beneath it.",
  environment: [
    {
      title: "Local Workstation (Fedora 44 KDE)",
      items: [
        "Development environment with Zed Editor and standard Unix tooling",
        "Python 3.12+ execution container",
        "Local NVMe flash storage simulating disk blocks & file transactions"
      ]
    },
    {
      title: "Remote Enterprise Node (Ubuntu Server 24.04 LTS)",
      items: [
        "Headless production node sitting across the network boundaries",
        "Dockerized ERPNext instance serving ERP schemas and Restful APIs",
        "Physical boundary enforcing protocol handling and network latency"
      ]
    }
  ],
  methodology: "Every concept adheres to physical constraints. We never adopt an abstraction—be it a database driver, an ORM, or a network protocol—until we have manually built the underlying mechanism and hit the physical performance or reliability wall it solves."
};

export const curriculumPhases: CurriculumPhase[] = [
  {
    id: 1,
    title: "Phase 1: Local Structured Data Systems",
    goals: [
      "Understand physical bytes on NVMe disk vs structured types in memory",
      "Parse CSV and JSON from first principles without heavy database engines",
      "Master Python dictionary manipulation and garbage-collection boundaries"
    ],
    tooling: "Python 3.12 (Standard Lib), ext4 filesystem, htop, strace, Zed Editor",
    project: "Parse 20 rows of raw CNC logs, scale execution payload to 500, then stream-process 100,000 lines of system telemetry efficiently.",
    exitCriteria: [
      "Manually construct a raw CSV showing CNC operational telemetry",
      "Merge JSON order metadata with raw CSV logs in a single runtime loop",
      "Process 100,000 lines under strict memory limits using chunk/generator streams",
      "Analyze strace logs to verify standard system read blocks"
    ],
    details: [
      {
        title: "1. Mental Model",
        text: "Think of your storage drive as a massive grid of physical lockers (blocks) holding binary voltage traces. Data formats like CSV and JSON are not 'objects'; they are plain-text schemas applied to layout strings of characters. Your computer parses these bytes into structured trees inside your volatile RAM."
      },
      {
        title: "2. Executable First-Principles Snippet",
        text: "```python\nimport csv\nimport json\n\n# Open and parse raw disk bytes dynamically\nwith open('cnc_sensors.csv', mode='r', encoding='utf-8') as file:\n    reader = csv.DictReader(file)\n    for row in reader:\n        temperature = float(row['temp'])\n        if temperature > 115.4:\n            print(f\"[ALERT] CNC ID {row['cnc_id']} threshold exceeded: {temperature}C\")\n```"
      },
      {
        title: "3. Physical Reality",
        text: "When `open()` is executed, Python initiates a blocking syscall (`SYS_openat`). The Linux kernel references the ext4 inode table, locates the physical sector coordinates on your NVMe, and sends active signals to transfer data blocks into a kernel page buffer, which is finally copied into Python's addressable process RAM space."
      }
    ],
    docLinks: [
      {
        title: "Python CSV Module Documentation",
        url: "https://docs.python.org/3/library/csv.html",
        category: "Python Standard Library",
        summary: "Covers DictReader and DictWriter for streaming tabulating lines directly from files descriptors, avoiding high-memory buffer loads."
      },
      {
        title: "Python JSON Encoder/Decoder",
        url: "https://docs.python.org/3/library/json.html",
        category: "Serialization Reference",
        summary: "Describes mapping between JSON types and native Python associative datatypes, detailing streaming encoders for massive documents."
      },
      {
        title: "Linux Ext4 Filesystem Specifications",
        url: "https://ext4.wiki.kernel.org/index.php/Ext4_Disk_Layout",
        category: "Filesystem Layer",
        summary: "Detailed physical specification of block groups, inode allocation, and how disk directory listings map names to byte extents."
      }
    ],
    architecture: {
      nodes: [
        { id: '1-disk', label: 'Physical NVMe Drive (ext4)', type: 'storage', description: 'Unstructured ASCII CSV rows on physical sectors on disk blocks.' },
        { id: '1-kernel', label: 'OS Kernel Page Cache', type: 'system', description: 'VFS Layer caching disk blocks into RAM, triggering kernel space reads.' },
        { id: '1-py-gen', label: 'Python Stream Generator', type: 'process', description: 'Sequential parser reading buffers chunk-by-chunk to yield single-row memory objects.' },
        { id: '1-ram', label: 'Volatile RAM Heap', type: 'storage', description: 'Addressable heap containing garbage-collected Python lists, strings, and dictionaries.' }
      ],
      edges: [
        { from: '1-disk', to: '1-kernel', label: 'Syscall SYS_openat', action: 'OS fetches file descriptors and physical inodes.' },
        { from: '1-kernel', to: '1-py-gen', label: 'Generator Stream', action: 'Reads batches of 4096-byte sequences sequentially.' },
        { from: '1-py-gen', to: '1-ram', label: 'Garbage Collector allocation', action: 'Allocates structured objects, shedding reference markers.' }
      ],
      description: "How ASCII streams transitions from hardware boundaries into garbage-collected virtual machine states.",
      interactionPrompt: "Click on the blocks to follow the trajectory of raw data bytes from solid state hardware registers up to standard dynamic Python variables."
    },
    audioSpeech: [
      { id: 1, text: "Welcome to Phase 1. Before we touch enterprise server infrastructure, we must look at how files work locally.", timestamp: "00:00" },
      { id: 2, text: "A CSV is not a magic data structure; it is raw bytes on disk separated by commas and linebreaks. We write a custom stream loop to inspect how the Linux kernel executes syscalls.", timestamp: "00:15" },
      { id: 3, text: "Our goal here is to load, parse, and evaluate 100,000 log records under strict memory limits using first-principles streaming generators rather than greedy full-file array allocation.", timestamp: "00:32" }
    ]
  },
  {
    id: 2,
    title: "Phase 2: SQLite and SQL Foundations",
    goals: [
      "Understand standard normalized database systems",
      "Model relational schemas and map fields explicitly to column types",
      "Master indices and B-Tree traversals over full tabular files"
    ],
    tooling: "sqlite3 CLI, DB Browser for SQLite, DDL specs",
    project: "Design a fully normalized database schema mapping the AeroParts domain and query relations from a terminal sqlite console.",
    exitCriteria: [
      "Draft a 3-table normalized relational layout (machines, products, metric_logs)",
      "Configure foreign keys with cascading updates and transactional delete restrictions",
      "Compile indices on queried properties and evaluate execution paths with EXPLAIN QUERY PLAN",
      "Import previous Phase CSV data using CLI raw mode"
    ],
    details: [
      {
        title: "1. Mental Model",
        text: "Relational engines are state-machines that treat tables as structured coordinate spaces. By writing static DDL (Data Definition Language) schemas, you enforce type safety and constraints directly at the disk layer, ensuring no corrupted state write can ever occur."
      },
      {
        title: "2. Executable First-Principles Snippet",
        text: "```sql\n-- Establish tables with relational properties\nCREATE TABLE cnc_machines (\n    id INTEGER PRIMARY KEY AUTOINCREMENT,\n    model_number TEXT UNIQUE NOT NULL,\n    voltage_rating REAL NOT NULL\n);\n\nCREATE INDEX idx_machine_model ON cnc_machines(model_number);\n```"
      },
      {
        title: "3. Physical Reality",
        text: "When indexing with a B-Tree, SQLite structures the database file into dedicated balanced blocks (pages). Queries jump between branch keys to isolate targets in algorithmic logarithmic steps (O(log N)), avoiding linear disk-reading passes (O(N))."
      }
    ],
    docLinks: [
      {
        title: "SQLite Official Documentation Home",
        url: "https://sqlite.org/docs.html",
        category: "Database Documentation",
        summary: "The definitive guide to SQLite architecture, SQL limits, file structures, and the raw SQL dialect specifications."
      },
      {
        title: "SQLite Command Line Interface (CLI) Guide",
        url: "https://sqlite.org/cli.html",
        category: "CLI Operations",
        summary: "Step-by-step instructions for utilizing dot commands (.mode, .import, .explain) to manage relational local processes in your terminal."
      },
      {
        title: "Understanding B-Trees and Databases Indices",
        url: "https://sqlite.org/optoverview.html",
        category: "Database Performance Theory",
        summary: "An overview of how the SQLite query optimizer makes use of indexes to replace expensive table scans with fast branch lookups."
      }
    ],
    architecture: {
      nodes: [
        { id: '2-cli', label: 'SQLite CLI (.db file)', type: 'user', description: 'Local interface writing transactions straight to a single binary db file.' },
        { id: '2-btree', label: 'Balanced B-Tree Pages', type: 'storage', description: 'A structured layout of 4096-byte pages mapping keys to disk offsets.' },
        { id: '2-tables', label: 'Normalized Tables', type: 'system', description: 'Enforces tables containing strictly formatted strings, reals, and constraint blocks.' }
      ],
      edges: [
        { from: '2-cli', to: '2-btree', label: 'EXPLAIN QUERY PLAN', action: 'Traces physical indexing paths.' },
        { from: '2-btree', to: '2-tables', label: 'Foreign Key Verification', action: 'Checks pointer consistency across storage tables on transaction commit.' }
      ],
      description: "How structural index layouts partition disk space into constant-time querying segments.",
      interactionPrompt: "Click nodes to trace how queries traverse a tree topology on disk to bypass full-file reads."
    },
    audioSpeech: [
      { id: 1, text: "In pre-database setups, locating a specific log line in a five gigabyte file requires reading everything. Relational files bypass this bottleneck.", timestamp: "00:00" },
      { id: 2, text: "We define schema structures containing strict tables. This locks in schema-level type enforcement and builds indices using B-Trees.", timestamp: "00:14" },
      { id: 3, text: "Instead of scanning the disk block by block, SQLite navigates search layers in micro-seconds, loading only the necessary database pages.", timestamp: "00:30" }
    ]
  },
  {
    id: 3,
    title: "Phase 3: Python + SQLite Integration",
    goals: [
      "Securely connect native Python drivers to local database locks",
      "Master ACID transaction boundaries explicitly",
      "Defeat SQL injection by parameters compilation bindings"
    ],
    tooling: "Python standard sqlite3 driver, raw terminal script runs",
    project: "Build an active pipeline script that parses raw machinery streams, validates logs, and persists atomic transactions safely.",
    exitCriteria: [
      "Open database context handlers in Python ensuring connection closures",
      "Execute safe parameter bindings with tuple parameters to bypass payload injection",
      "Demonstrate ROLLBACK on malformed telemetry lists",
      "Leverage fast executemany() bulk inserts to optimize bulk disk modifications"
    ],
    details: [
      {
        title: "1. Mental Model",
        text: "Your Python engine runs instructions sequentially. The sqlite3 driver acts as a memory dispatcher, marshalling dynamic Python variables into SQLite SQL parsers and pulling raw relation tables back as structured Python datasets."
      },
      {
        title: "2. Executable First-Principles Snippet",
        text: "```python\nimport sqlite3\n\n# Utilize contextual managers to lock and process transactions\nwith sqlite3.connect('aeroparts.db') as conn:\n    cursor = conn.cursor()\n    # Prevent SQL injection attacks by segmenting input data\n    sql = \"INSERT INTO cnc_machines (model_number, voltage_rating) VALUES (?, ?)\"\n    cursor.execute(sql, (\"CNC-PRO-009\", 480.0))\n    # Transaction commits automatically on successful exit\n```"
      },
      {
        title: "3. Physical Reality",
        text: "Using parameterized bindings prevents SQL injection by separating code from data. The client's string input is treated purely as a literal value inside the database's execution engine, never as unescaped SQL commands that could manipulate the balance sheets."
      }
    ],
    docLinks: [
      {
        title: "Python Standard DB-API 2.0 (sqlite3) Reference",
        url: "https://docs.python.org/3/library/sqlite3.html",
        category: "Python API Reference",
        summary: "Specifies connection managers, cursor objects, isolation levels, and bulk transaction management bindings."
      },
      {
        title: "OWASP SQL Injection Prevention Cheat Sheet",
        url: "https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html",
        category: "Application Security",
        summary: "Crucial technical guidance describing parameterization principles and the internal parser paths of modern engines."
      }
    ],
    architecture: {
      nodes: [
        { id: '3-py', label: 'Python Application Session', type: 'user', description: 'Hosts business variables, file queues, and local system operations.' },
        { id: '3-driver', label: 'C-Language Wrapper (sqlite3)', type: 'process', description: 'Bridges Python VM memory contexts to SQLite native C structures.' },
        { id: '3-lock', label: 'Journal Lock file (.db-journal)', type: 'storage', description: 'Keeps rollback logs to preserve transaction integrity (rollback capability).' }
      ],
      edges: [
        { from: '3-py', to: '3-driver', label: 'Parameterized execute()', action: 'Binds dynamic array pointers, bypassing text-level evaluation.' },
        { from: '3-driver', to: '3-lock', label: 'ACID transactional rollback', action: 'Ensures writes either persist fully or leave disk exactly unchanged.' }
      ],
      description: "How Python processes handle isolation zones when communicating with atomic filesystem structures.",
      interactionPrompt: "Trigger operations to watch rollback files secure physical blocks in case memory operations raise execution errors."
    },
    audioSpeech: [
      { id: 1, text: "Phase three is where we bridge execution scripts and databases. We integrate Python's dynamic runtime with SQLite's C-bindings.", timestamp: "00:00" },
      { id: 2, text: "We explicitly implement parameterized tuples to avoid security injections, making sure string injection cannot alter code structures.", timestamp: "00:15" },
      { id: 3, text: "We learn how sqlite locks database structures with temp journal logs to protect the system during mid-write OS power losses.", timestamp: "00:32" }
    ]
  },
  {
    id: 4,
    title: "Phase 4: Data Transformation and Analytics",
    goals: [
      "Eliminate slow row loops by implementing vectorized arrays",
      "Compute statistics and statistical anomalies using Pandas on dynamic sets",
      "Process high-dimensional datasets with zero intermediate file allocation"
    ],
    tooling: "Python Pandas, NumPy, statistical vectorization libraries",
    project: "Isolate defect patterns in CNC telemetry streams using array aggregation algorithms, outputting anomaly metrics.",
    exitCriteria: [
      "Load SQLite tables dynamically into high-performance Pandas DataFrames",
      "Implement numeric column arithmetic with vector operations, avoiding loops",
      "Filter sensor anomaly bands based on standard deviation margins",
      "Write processed analytical summaries back to structured SQLite tables"
    ],
    details: [
      {
        title: "1. Mental Model",
        text: "While SQL handles persistence and lookup, heavy statistics are slow in database engines. Pandas structures memory into columnar continuous C-language arrays. This enables calculations like standard deviations to occur in rapid parallel operations."
      },
      {
        title: "2. Executable First-Principles Snippet",
        text: "```python\nimport pandas as pd\nimport sqlite3\n\n# Stream SQLite queries directly into RAM structures\ncon = sqlite3.connect('aeroparts.db')\ndf = pd.read_sql_query(\"SELECT * FROM sensor_readings\", con)\n\n# Fast scalar operation calculated instantly over all index positions\ndf['deviation'] = (df['temp'] - df['temp'].mean()) / df['temp'].std()\nanomalies = df[df['deviation'].abs() > 3.0]\n```"
      },
      {
        title: "3. Physical Reality",
        text: "Standard Python structures data with pointers to scattered memory allocations, creating high overhead. Pandas columns are allocated as continuous, contiguous regions in memory. Your CPU accesses these values sequentially in L1/L2 caches, performing SIMD steps to calculate columns in milliseconds."
      }
    ],
    docLinks: [
      {
        title: "Pandas User Guide & API Docs",
        url: "https://pandas.pydata.org/docs/user_guide/index.html",
        category: "Analytics Documentation",
        summary: "The official user guide outlining DataFrame internals, relational merging operations, and analytical aggregations."
      },
      {
        title: "NumPy Array Mechanics Guide",
        url: "https://numpy.org/doc/stable/user/absolute_beginners.html",
        category: "Numerical Computing",
        summary: "Explains how structured continuous C arrays are allocated on the system heap to allow parallel CPU math execution."
      }
    ],
    architecture: {
      nodes: [
        { id: '4-db', label: 'SQLite DB Files', type: 'storage', description: 'Persistent structured file containing database rows.' },
        { id: '4-ram', label: 'Continuous C Memory Buffer', type: 'system', description: 'Packed sequence of floating-point values sitting sequentially in CPU cache lines.' },
        { id: '4-simd', label: 'CPU SIMD Execution Engine', type: 'process', description: 'Hardware-level instruction applying single transformations over multiple array coordinates.' }
      ],
      edges: [
        { from: '4-db', to: '4-ram', label: 'Pandas read_sql', action: 'Streams DB blocks to sequential memory blocks in RAM.' },
        { from: '4-ram', to: '4-simd', label: 'Vectorized operations', action: 'Bypasses Python iteration by executing math inside hardware register loops.' }
      ],
      description: "How array vectorization transforms slow interpreter steps into pure hardware calculations.",
      interactionPrompt: "Interact with the blocks to see how linear Python pointer searches compare to vectorized array sweeps."
    },
    audioSpeech: [
      { id: 1, text: "In phase four, we process massive numeric datasets. Running a Python loop over million-row data arrays is a critical performance error.", timestamp: "00:00" },
      { id: 2, text: "Instead, we use Pandas to load records straight into contiguous C arrays. This allows direct hardware operations.", timestamp: "00:15" },
      { id: 3, text: "We execute vectorized calculations that run in parallel on your CPU, transforming analysis times from minutes to milliseconds.", timestamp: "00:31" }
    ]
  },
  {
    id: 5,
    title: "Phase 5: Validation and Schemas with Pydantic",
    goals: [
      "Understand dynamic typing gaps at physical system boundaries",
      "Establish strict deserialization models in server operations",
      "Build custom coercion and validate incoming API schemas"
    ],
    tooling: "Python Pydantic, static typing descriptors",
    project: "Define the parsing gateway validating telemetry structures prior to writing records to SQL blocks.",
    exitCriteria: [
      "Build recursive validation structures using Pydantic BaseModel configurations",
      "Write custom field checks enforcing physical checks (e.g. positive temperature limits)",
      "Compile clear error handling blocks isolating failed properties",
      "Refactor previous stream loading tools to filter input records through strict validation steps"
    ],
    details: [
      {
        title: "1. Mental Model",
        text: "Dynamic systems must enforce validation boundaries. While database tables reject bad schema operations, you want bad payloads filtered at the program entryway (validation layer) to prevent database level transaction crashes and keep the storage pipeline green."
      },
      {
        title: "2. Executable First-Principles Snippet",
        text: "```python\nfrom pydantic import BaseModel, Field, field_validator\n\nclass CNCLog(BaseModel):\n    cnc_id: int\n    temp: float = Field(lt=150.0) # Absolute temperature constraint\n\n    @field_validator('cnc_id')\n    def validate_positive_id(cls, value):\n        if value <= 0:\n            raise ValueError(\"Manufacturing ID must be positive\")\n        return value\n```"
      },
      {
        title: "3. Physical Reality",
        text: "Pydantic (built with an underlying Rust validate engine) compiles Python structures down to memory rules. Unvalidated strings and integers entering the application are parsed, type-coerced if safe, and mapped directly to system variables in optimized binary layers."
      }
    ],
    docLinks: [
      {
        title: "Pydantic V2 Technical Specifications",
        url: "https://docs.pydantic.dev/latest/",
        category: "Validation Standard",
        summary: "The official guide detailing schemas, performance benchmarks, Rust validation cores, and strict validation compilation modes."
      },
      {
        title: "PEP 484 — Type Hints Documentation",
        url: "https://peps.python.org/pep-0484/",
        category: "Python Specification",
        summary: "The formal Python standard for typing specifications, which Pydantic scales to run dynamic parsing checks at runtime."
      }
    ],
    architecture: {
      nodes: [
        { id: '5-net', label: 'Raw Unsecured API Payload', type: 'network', description: 'String values containing untrusted formatting and types.' },
        { id: '5-pyd', label: 'Pydantic Schema Gate', type: 'process', description: 'Compiled system validation models processing incoming fields.' },
        { id: '5-clean', label: 'Type-Safe Runtime Context', type: 'system', description: 'Verified objects guaranteed to align with memory specs, ready for storage.' }
      ],
      edges: [
        { from: '5-net', to: '5-pyd', label: 'Deserialization loop', action: 'Rust execution core reviews types and checks bounds.' },
        { from: '5-pyd', to: '5-clean', label: 'Strict Instance Initialization', action: 'Bounces invalid structures, outputting clean standard validation errors.' }
      ],
      description: "How dynamic application runtimes compile rigid entry gates to lock out corrupt state requests.",
      interactionPrompt: "Follow the raw payload to watch Pydantic block corrupted types from entering system memory blocks."
    },
    audioSpeech: [
      { id: 1, text: "Phase five tackles a vulnerability. Python is a dynamically typed system, meaning inputs can be strings when we expect integers.", timestamp: "00:00" },
      { id: 2, text: "Rather than validating fields manually with complex if-else trees, we build recursive schemas using Pydantic.", timestamp: "00:15" },
      { id: 3, text: "This acts as a strict guard, certifying that every payload is fully validated and typed before it can trigger database transactions.", timestamp: "00:30" }
    ]
  },
  {
    id: 6,
    title: "Phase 6: HTTP, APIs, and FastAPI",
    goals: [
      "Deconstruct client-server message formats over networks",
      "Model HTTP verbs and design modular web interface endpoints",
      "Handle incoming server packets and manage socket configurations"
    ],
    tooling: "FastAPI, Uvicorn, curl, ss, tcpdump, network interfaces",
    project: "Build and deploy a local REST API mapping AeroParts tables, tracking socket and active network states from your terminal.",
    exitCriteria: [
      "Initialize a FastAPI server bound to accessible interface IPs",
      "Inspect headers, methods, and payload bodies using raw curl terminals",
      "Expose endpoint architectures mapped to the SQLite database",
      "Trace network port bindings using terminal socket tools (`ss -ap` or `netstat` equivalence)"
    ],
    details: [
      {
        title: "1. Mental Model",
        text: "An API is a network socket listener running an event loop. Physical clients establish TCP streams, transmitting structured HTTP texts. The backend interprets the headers, matches URLs to code routes, and writes structured JSON strings back down the socket wire."
      },
      {
        title: "2. Executable First-Principles Snippet",
        text: "```python\nfrom fastapi import FastAPI, HTTPException, Header\nimport sqlite3\n\napp = FastAPI()\n\n@app.get(\"/cnc/status/{machine_id}\")\ndef read_cnc_status(machine_id: int, authorization: str = Header(None)):\n    if authorization != \"AeroSecretSecureKey\":\n        raise HTTPException(status_code=401, detail=\"Unauthorized API Access\")\n    # Run database query using valid parameter bounds...\n    return {\"cnc_id\": machine_id, \"status\": \"OPERATIONAL\"}\n```"
      },
      {
        title: "3. Physical Reality",
        text: "When starting Uvicorn, the OS reserves a TCP port (e.g., 3000) and keeps a socket open in the kernel. When a client connects, the network card triggers interrupts. The OS finishes the TCP 3-way handshake and handles the data stream, forwarding the decoded payload to Python's ASGI runtime loop."
      }
    ],
    docLinks: [
      {
        title: "FastAPI Complete Reference Guide",
        url: "https://fastapi.tiangolo.com/",
        category: "Web Framework",
        summary: "Covers ASGI specifications, dependency injection pipelines, endpoint structures, and autogenerated OpenAPI schemas."
      },
      {
        title: "Uvicorn ASGI Server Documentation",
        url: "https://www.uvicorn.org/",
        category: "ASGI Server",
        summary: "Describes event loops, physical worker processes, socket bindings, and server configurations in production environments."
      },
      {
        title: "RFC 9110 — HTTP Semantics and Architecture",
        url: "https://datatracker.ietf.org/doc/html/rfc9110",
        category: "Internet Standard",
        summary: "The absolute standard for the HTTP protocol, detailing header behavior, connection pipelines, and state codes."
      }
    ],
    architecture: {
      nodes: [
        { id: '6-client', label: 'CLI Client Terminal (curl)', type: 'user', description: 'Triggers HTTP network requests over network paths.' },
        { id: '6-kernel', label: 'OS Network TCP Stack', type: 'system', description: 'Manages sockets and buffer pools, completing handshakes.' },
        { id: '6-uvicorn', label: 'Uvicorn ASGI Runloop', type: 'process', description: 'Pipes raw socket data streams into dynamic ASGI scopes.' },
        { id: '6-fastapi', label: 'FastAPI Router', type: 'system', description: 'Routes requests to Python handlers and handles Pydantic serialization.' }
      ],
      edges: [
        { from: '6-client', to: '6-kernel', label: 'SYN / SYN-ACK / ACK', action: 'Establishes TCP transport layer paths.' },
        { from: '6-kernel', to: '6-uvicorn', label: 'File Descriptor read', action: 'Transfers connection payloads to application space.' },
        { from: '6-uvicorn', to: '6-fastapi', label: 'ASGI JSON Scope', action: 'Translates raw frames into standard dictionary layouts.' }
      ],
      description: "How network sockets translate raw bytes into structured application routes.",
      interactionPrompt: "Trace connections to watch physical NIC actions process electrical pulses into clean JSON responses."
    },
    audioSpeech: [
      { id: 1, text: "Phase six shifts our scope from local scripts to network sockets. We build an HTTP server using FastAPI.", timestamp: "00:00" },
      { id: 2, text: "Every API endpoint is just a socket handler. We trace raw headers and responses using terminal curl commands.", timestamp: "00:14" },
      { id: 3, text: "You will watch the OS complete the TCP handshakes, pipe bytes to your process, and return structured JSON telemetry.", timestamp: "00:30" }
    ]
  },
  {
    id: 7,
    title: "Phase 7: Distributed Systems and ERPNext Integration",
    goals: [
      "Integrate separate systems across physical network boundaries",
      "Manage OAuth API tokens and headers securely over HTTPS",
      "Handle network retries and write synchronization logic"
    ],
    tooling: "Python requests, Ubuntu terminal SSH sessions, curl integrations",
    project: "Configure a synchronizer script on your local machine pushing local analytics up to ERPNext on your remote server.",
    exitCriteria: [
      "Access remote ERPNext API resources using authenticated headers",
      "Handle remote validation restrictions and map local schemas to ERP parameters",
      "Implement a synchronization script that updates local SQLite records to synced ONLY after receiving a 200 OK",
      "Write error-handling code that manages network time-outs and connection drops gracefully"
    ],
    details: [
      {
        title: "1. Mental Model",
        text: "In distributed applications, networks are unreliable. Your local script cannot assume the remote peer is healthy. You must treat any external API request as an asynchronous operations that can block, fail, timeout, or return corrupt states."
      },
      {
        title: "2. Executable First-Principles Snippet",
        text: "```python\nimport requests\nfrom requests.exceptions import RequestException\n\nerp_api_url = \"http://ubuntu-server-ip/api/resource/Production Log\"\nheaders = {\"Authorization\": \"token d309a...\"}\n\ntry:\n    response = requests.post(erp_api_url, json={\"output\": 45}, headers=headers, timeout=5.0)\n    if response.status_code == 200:\n        print(\"[SUCCESS] Remote ERP database verified and updated\")\nexcept RequestException as e:\n    print(f\"[RETRY TRIGGERED] Network connection interface timed out: {e}\")\n```"
      },
      {
        title: "3. Physical Reality",
        text: "Calling a remote API sends data packets over router hops. The packet travels from your local interface, through physical switches and optical fibers, to hit the remote server. When you implement a timeout, you configure the OS network stack to drop the socket if the remote server fails to return ACK packets within the allotted path timeline."
      }
    ],
    docLinks: [
      {
        title: "Python requests Library Developer Guide",
        url: "https://requests.readthedocs.io/en/latest/",
        category: "Network HTTP Client",
        summary: "Covers connection pooling, session objects, authentication setups, and exception handling protocols."
      },
      {
        title: "Frappe & ERPNext RESTful API Specifications",
        url: "https://frappeframework.com/docs/v14/user/en/api/rest",
        category: "Enterprise Integration",
        summary: "The core schema integration guide for Frappe resources, detailing dynamic endpoints, filters, and standard header token paths."
      }
    ],
    architecture: {
      nodes: [
        { id: '7-local', label: 'Local Ingestion Client (Fedora)', type: 'user', description: 'Triggers synchronization, querying raw anomalies from the SQL database.' },
        { id: '7-network', label: 'Physical Network Boundary', type: 'network', description: 'The unreliable transit layer, subject to route latency and packet loss.' },
        { id: '7-remote', label: 'Fulfillment ERPNext Engine (Ubuntu)', type: 'system', description: 'Enterprise node processing production lines and archiving states into MariaDB.' }
      ],
      edges: [
        { from: '7-local', to: '7-network', label: 'requests.post() with timeout', action: 'Transmits telemetry payloads across routing nodes.' },
        { from: '7-network', to: '7-remote', label: 'Nginx Proxy routing', action: 'Accepts API tokens and updates MariaDB state.' },
        { from: '7-remote', to: '7-local', label: '201 Created Response', action: 'Signals success, triggering local database record synchronization.' }
      ],
      description: "How distributed systems keep records in sync while managing latent and unreliable networks.",
      interactionPrompt: "Simulate a network drop to observe why timeouts are critical to prevent applications from hanging forever."
    },
    audioSpeech: [
      { id: 1, text: "Phase seven introduces distributed systems. We connect separate servers over physical network interfaces.", timestamp: "00:00" },
      { id: 2, text: "Networks are unreliable. We build our synchronization worker under the assumption that connections will fail.", timestamp: "00:14" },
      { id: 3, text: "We implement API token handling, manage connection dropouts with timeouts, and update local database rows ONLY when remote responses are verified.", timestamp: "00:32" }
    ]
  },
  {
    id: 8,
    title: "Phase 8: Advanced Data Architecture and MCP",
    goals: [
      "Understand physical database caching and page locking mechanics",
      "Model Model Context Protocol specs for structured data sharing",
      "Integrate AI assistants to analyze database schemas directly and query context safely"
    ],
    tooling: "MCP schemas, SQLite Internals, JSON-RPC protocols, terminal stdio streams",
    project: "Deploy an MCP JSON-RPC Server interface enabling AI tooling to query local manufacturing context safely.",
    exitCriteria: [
      "Expose standard JSON-RPC request structures over terminal stdio pipelines",
      "Implement the official Model Context Protocol (MCP) tool schema definitions",
      "Integrate the local MCP server with development environment AI components (Zed / Claude Desktop)",
      "Log database page metrics and trace cache performance indicators during AI context lookups"
    ],
    details: [
      {
        title: "1. Mental Model",
        text: "The Model Context Protocol (MCP) sets a standardized, framework-agnostic contract between large AI systems and physical local files. Rather than feeding model prompts with static text blocks, the MCP server opens schema boundaries, evaluating dynamically structured queries in real-time."
      },
      {
        title: "2. Executable First-Principles Snippet",
        text: "```python\n# MCP JSON-RPC stdio handler protocol\nimport sys\nimport json\n\ndef mcp_response(request_id, result):\n    response = {\n        \"jsonrpc\": \"2.0\",\n        \"id\": request_id,\n        \"result\": result\n    }\n    sys.stdout.write(json.dumps(response) + \"\\n\")\n    sys.stdout.flush()\n```"
      },
      {
        title: "3. Physical Reality",
        text: "The editor execution thread opens a standard subprocess, wiring into your Python application's standard input and standard output pipes. Bytes are formatted as JSON-RPC messages, decoded by Python, and routed straight down native SQLite connection streams to fetch context indices directly on active storage pages."
      }
    ],
    docLinks: [
      {
        title: "Model Context Protocol (MCP) Specification",
        url: "https://modelcontextprotocol.io/",
        category: "AI Integration Standards",
        summary: "The complete technical overview of the Model Context Protocol, explaining stdio transport streams and tool schemas."
      },
      {
        title: "SQLite File Format and Block Internals",
        url: "https://sqlite.org/fileformat.html",
        category: "Database Internals",
        summary: "Deep architectural spec outlining b-tree leaf designs, vacuum procedures, header markers, and cache management."
      }
    ],
    architecture: {
      nodes: [
        { id: '8-llm', label: 'Local LLM Agent Context (Zed/Claude)', type: 'user', description: 'Requires dynamic information to resolve development tasks.' },
        { id: '8-rpc', label: 'JSON-RPC over stdio', type: 'network', description: 'Bidirectional IPC pipe routing requests over stdout and stdin boundaries.' },
        { id: '8-mcp', label: 'MCP Python Server', type: 'process', description: 'Exposes local tools schemas and translates instructions to SQL queries.' },
        { id: '8-sqlite', label: 'SQLite File Engine', type: 'storage', description: 'Reads index blocks from NVMe storage straight into system cache buffers.' }
      ],
      edges: [
        { from: '8-llm', to: '8-rpc', label: 'Subprocess Pipe', action: 'Writes JSON-RPC requests.' },
        { from: '8-rpc', to: '8-mcp', label: 'Event handler loop', action: 'Decodes queries and resolves requested database parameters.' },
        { from: '8-mcp', to: '8-sqlite', label: 'SQL index lookup', action: 'Fetches cached physical database entries and returns tool results.' }
      ],
      description: "How AI tools securely query and control physical infrastructure using standard protocols.",
      interactionPrompt: "Click checkpoints to map the communication roundtrip between developer prompts and local SQLite pages."
    },
    audioSpeech: [
      { id: 1, text: "Welcome to Phase eight, our final milestone. We bridge our engineering achievements with AI tooling using the Model Context Protocol.", timestamp: "00:00" },
      { id: 2, text: "MCP establishes standard protocols, allowing AI to safely inquire about what commands it can run on our systems.", timestamp: "00:15" },
      { id: 3, text: "Rather than giving files directly, we deploy an MCP server over SQLite, allowing agents to fetch manufacturing details contextually.", timestamp: "00:32" }
    ]
  }
];
