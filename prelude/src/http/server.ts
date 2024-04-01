import fastify from "fastify";
import serverEntryPointPlugin from "./entry";

const server = fastify({ logger: true });

server
	.register(serverEntryPointPlugin)
	.then(() => server.listen({ port: server.config.APP_PORT, host: "0.0.0.0" }));
