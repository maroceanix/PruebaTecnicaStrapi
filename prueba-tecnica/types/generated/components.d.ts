import type { Schema, Struct } from '@strapi/strapi';

export interface AlergenosAlergenos extends Struct.ComponentSchema {
  collectionName: 'components_alergenos_alergenos';
  info: {
    displayName: 'alergenos';
    icon: 'seed';
  };
  attributes: {
    descripcion_alergeno: Schema.Attribute.String;
    icono: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    nombre_alergeno: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'alergenos.alergenos': AlergenosAlergenos;
    }
  }
}
