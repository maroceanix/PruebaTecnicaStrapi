/**
 * plato controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController("api::plato.plato", ({ strapi }) => ({
    async obtenerPlatosPopulares(ctx) {
        const resultado = await strapi
            .service("api::plato.plato")
            .obtenerPlatosPopulares();
        ctx.send(resultado);
    },
}));
