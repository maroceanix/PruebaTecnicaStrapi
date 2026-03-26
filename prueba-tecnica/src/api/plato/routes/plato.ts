export default {
    routes: [
        {
            method: "GET",
            path: "/platos/populares",
            handler: "plato.obtenerPlatosPopulares",
        },
    ],
};
