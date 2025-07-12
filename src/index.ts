import "module-alias/register";
import "reflect-metadata";
import { PORT } from "./config/env";
import { createServer } from "./server";

const server = createServer();

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
