import { IdbFs, MemoryFS, PGlite } from "@electric-sql/pglite";
import { citext } from "@electric-sql/pglite/contrib/citext";
import { fuzzystrmatch } from "@electric-sql/pglite/contrib/fuzzystrmatch";
import { uuid_ossp } from "@electric-sql/pglite/contrib/uuid_ossp";
import { worker } from "@electric-sql/pglite/worker";

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
