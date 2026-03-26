import { factories } from "@strapi/strapi";
import { errors } from "@strapi/utils";

export default factories.createCoreService(
        "api::menu-diario.menu-diario",
        ({ strapi }) => ({
                async calcularSumaBase(primerId, segundoId, postreId) {
                        const primero = await strapi.db
                                .query("api::plato.plato")
                                .findOne({
                                        where: { id: primerId },
                                });

                        const segundo = await strapi.db
                                .query("api::plato.plato")
                                .findOne({
                                        where: { id: segundoId },
                                });
                        const postre = await strapi.db.query("api::plato.plato").findOne({
                                where: { id: postreId },
                        });

                        const primeroPrecio = primero?.precio_plato || 0;
                        const segundoPrecio = segundo?.precio_plato || 0;
                        const postrePrecio = postre?.precio_plato || 0;

                        const totalPrecio = primeroPrecio + segundoPrecio + postrePrecio;
                        return totalPrecio;
                },

                async agregarImpuesto(documentIdd, impuestoPorcentaje) {
                        const menu = await strapi
                                .documents("api::menu-diario.menu-diario")
                                .findOne({
                                        documentId: documentIdd,
                                        populate: ["primero", "segundo", "postre"],
                                });
                        const sumaBase = await this.calcularSumaBase(
                                menu.primero.id,
                                menu.segundo.id,
                                menu.postre.id,
                        );
                        const precioConImpuesto =
                                sumaBase * (1 + impuestoPorcentaje / 100);

                        return await strapi
                                .documents("api::menu-diario.menu-diario")
                                .update({
                                        documentId: documentIdd,
                                        data: {
                                                precio_con_impuesto: precioConImpuesto,
                                        },
                                });
                },
                async obtenerPrecioPlatos(documentId) {
                        const menu = await strapi
                                .documents("api::menu-diario.menu-diario")
                                .findOne({
                                        documentId,
                                        populate: ["primero", "segundo", "postre"],
                                });

                        if (menu) {
                                const primeroPrecio = menu.primero.precio_plato || 0;
                                const segundoPrecio = menu.segundo.precio_plato || 0;
                                const postrePrecio = menu.postre.precio_plato || 0;
                                return { primeroPrecio, segundoPrecio, postrePrecio };
                        }
                },
                async validarPlatosUnicos(primero, segundo, postre) {
                        //valida que estén los 3 platos, y que no se repitan
                        if (!primero || !segundo || !postre) {
                                throw new errors.ValidationError(
                                        "El menú debe tener todos los platos asignados",
                                );
                        }
                        const ids = new Set([
                                primero.documentId,
                                segundo.documentId,
                                postre.documentId,
                        ]);
                        if (ids.size < 3) {
                                throw new errors.ValidationError(
                                        "Los platos en el menú deben ser únicos",
                                );
                        }
                },
                async obtenerPlatosSinAlergenos(excluirString: string) {
                        const alergenosExcluir = excluirString
                                .split(",")
                                .map((alergeno) => alergeno.trim().toLowerCase());
                        const menus = await strapi
                                .documents("api::menu-diario.menu-diario")
                                .findMany({
                                        populate: {
                                                primero: { populate: ["alergenos"] },
                                                segundo: { populate: ["alergenos"] },
                                                postre: { populate: ["alergenos"] },
                                        },
                                });
                        const menusFiltrados = menus.filter((menu) => {
                                const platos = [menu.primero, menu.segundo, menu.postre];

                                return !platos.some((plato) =>
                                        plato?.alergenos?.some((alergeno) => {
                                                const nombreAlergeno = (
                                                        alergeno.nombre_alergeno || ""
                                                ).toLowerCase();
                                                return alergenosExcluir.includes(
                                                        nombreAlergeno,
                                                );
                                        }),
                                );
                        });

                        return menusFiltrados;
                },
        }),
);
