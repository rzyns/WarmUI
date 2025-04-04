import { IdbFs, MemoryFS, PGlite } from "@electric-sql/pglite";
import { worker } from "@electric-sql/pglite/worker";

import { citext } from "@electric-sql/pglite/contrib/citext";
import { uuid_ossp } from "@electric-sql/pglite/contrib/uuid_ossp";
import { fuzzystrmatch } from "@electric-sql/pglite/contrib/fuzzystrmatch";

worker({
    async init(workerOpts) {
        return new PGlite({
            ...workerOpts,
            fs: new IdbFs("warmui"),
            extensions: {
                ...workerOpts.extensions,
                citext,
                fuzzystrmatch,
                uuid_ossp,
            },
    });
    },
});
