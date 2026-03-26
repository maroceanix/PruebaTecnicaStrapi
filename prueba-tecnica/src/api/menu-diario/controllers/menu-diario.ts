/**
 * menu-diario controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
    "api::menu-diario.menu-diario",
    ({ strapi }) => ({
        async agregarImpuesto(ctx) {
            const { documentId } = ctx.params;
            const { impuestoPorcentaje } = ctx.request.body;
            const result = await strapi
                .service("api::menu-diario.menu-diario")
                .agregarImpuesto(documentId, impuestoPorcentaje);
            ctx.send(result);
        },

        async obtenerPostresMenu(ctx) {
            const menus = await strapi
                .documents("api::menu-diario.menu-diario")
                .findMany({
                    populate: {
                        postre: true,
                    },
                });
            const postres = menus.map((menu) => menu.postre);
            ctx.send(postres);
        },
        async filtrarMenuPorRangoPrecio(ctx) {
            const precioMin = parseFloat(ctx.query.precioMin as string);
            const precioMax = parseFloat(ctx.query.precioMax as string);
            const menus = await strapi
                .documents("api::menu-diario.menu-diario")
                .findMany({
                    filters: {
                        sum_precio: {
                            $gte: precioMin,
                            $lte: precioMax,
                        },
                    },
                });
            ctx.send(menus);
        },
        async obtenerPlatosSinAlergenos(ctx) {
            const { excluir_alergenos } = ctx.query;
            if (!excluir_alergenos)
                return ctx.badRequest("Debes pasar alérgenos a excluir");
            const menus = await strapi
                .service("api::menu-diario.menu-diario")
                .obtenerPlatosSinAlergenos(excluir_alergenos as string); //le paso los alérgenos al método de services que se encarga de la lógica
            ctx.send(menus);
        },
    }),
);
