/**
 * plato service
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreService("api::plato.plato", ({ strapi }) => ({
        async obtenerPlatosPopulares() {
                const menus = await strapi
                        .documents("api::menu-diario.menu-diario")
                        .findMany({
                                populate: ["primero", "segundo", "postre"],
                        });

                const conteo = {};
                for (const menu of menus) {
                        const platos = [menu.primero, menu.segundo, menu.postre];
                        for (const plato of platos) {
                                if (plato) {
                                        conteo[plato.id] = (conteo[plato.id] || 0) + 1;
                                }
                        }
                }
                const platosOrdenados = Object.entries(conteo).sort(
                        ([, a], [, b]) => (b as number) - (a as number),
                );

                const [idMasPopular] = platosOrdenados[0]; //coge el primer elemento (el más popular)

                const plato = await strapi.db.query("api::plato.plato").findOne({
                        where: { id: parseInt(idMasPopular) },
                });

                return { nombre: plato.nombre, cantidad: platosOrdenados[0][1] };
        },
}));
