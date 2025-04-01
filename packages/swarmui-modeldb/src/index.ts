import { PGlite } from "@electric-sql/pglite";
import { live } from "@electric-sql/pglite/live";
import { citext } from "@electric-sql/pglite/contrib/citext";
import { fuzzystrmatch } from "@electric-sql/pglite/contrib/fuzzystrmatch";
import { uuid_ossp } from "@electric-sql/pglite/contrib/uuid_ossp";

export function init() {
    const db = new PGlite("idb://swarmui-modeldb", { extensions: { live, citext, fuzzystrmatch, uuid_ossp  } });
}
