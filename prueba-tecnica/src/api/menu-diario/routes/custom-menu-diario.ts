export default {
        routes: [
                {
                        method: "POST",
                        path: "/menu-diario/:documentId/:impuestoPorcentaje",
                        handler: "menu-diario.agregarImpuesto",
                },
                {
                        method: "GET",
                        path: "/menu-diario/postres",
                        handler: "menu-diario.obtenerPostresMenu",
                },
                {
                        method: "GET",
                        path: "/menu-diario/filtrar",
                        handler: "menu-diario.filtrarMenuPorRangoPrecio",
                },
        ],
};
