import { errors } from "@strapi/utils";

export default {
        async beforeCreate(event) {
                await updateMenuTotal(event);
        },

        async beforeUpdate(event) {
                await updateMenuTotal(event);
        },
};

async function updateMenuTotal(event) {
        const data = event.params.data;
        if (
                data.precio_con_impuesto !== undefined &&
                !data.primero &&
                !data.segundo &&
                !data.postre
        )
                return;
        const primeroId = data.primero?.connect?.[0]?.id ?? data.primero?.set?.[0]?.id;
        const segundoId = data.segundo?.connect?.[0]?.id ?? data.segundo?.set?.[0]?.id;
        const postreId = data.postre?.connect?.[0]?.id ?? data.postre?.set?.[0]?.id;
        if (!primeroId || !segundoId || !postreId) {
                const menu = await strapi.db
                        .query("api::menu-diario.menu-diario")
                        .findOne({
                                where: { documentId: data.documentId },
                                populate: ["primero", "segundo", "postre"],
                        });

                //valido antes que los platos no se repitan, si lanza error no se actualiza el precio

                await strapi
                        .service("api::menu-diario.menu-diario")
                        .validarPlatosUnicos(menu.primero, menu.segundo, menu.postre);
                data.sum_precio =
                        menu.primero.precio_plato +
                        menu.segundo.precio_plato +
                        menu.postre.precio_plato;
        } else {
                if (
                        primeroId === segundoId ||
                        primeroId === postreId ||
                        segundoId === postreId
                ) {
                        throw new errors.ValidationError(
                                "Los platos en el menú deben ser únicos",
                        );
                }
                const total = await strapi
                        .service("api::menu-diario.menu-diario")
                        .calcularSumaBase(primeroId, segundoId, postreId);

                data.sum_precio = total;
        }
}
