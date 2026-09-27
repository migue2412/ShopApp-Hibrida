# ShopApp Híbrida

Proyecto académico de tienda online desarrollado con **Ionic React + Capacitor**.

## Funcionalidades

- Autenticación de demostración.
- Consumo de API REST mediante DummyJSON.
- CRUD de productos: consultar, crear, actualizar y eliminar.
- Carrito de compras.
- Persistencia local mediante `localStorage`.
- Preparación para Android e iOS mediante Capacitor.
- Diseño adaptable para navegador y dispositivos móviles.

## Requisitos

- Node.js 20 LTS recomendado.
- npm.
- Android Studio para Android.
- macOS + Xcode para compilar iOS.

## Instalación

```bash
npm install
npm run dev
```

## Preparar Android

```bash
npm run build
npx cap add android
npx cap sync android
npx cap open android
```

Si la carpeta `android` ya existe, usar:

```bash
npm run build
npx cap sync android
npx cap open android
```

## Preparar iOS

En macOS:

```bash
npm run build
npx cap add ios
npx cap sync ios
npx cap open ios
```

## Evidencias sugeridas para la entrega

1. Pantalla de inicio de sesión.
2. Catálogo cargado desde API.
3. Creación de producto.
4. Edición de producto.
5. Eliminación de producto.
6. Producto agregado al carrito.
7. Persistencia del carrito después de recargar.
8. Proyecto Android abierto en Android Studio.
9. Aplicación ejecutada en emulador Android.
10. Proyecto iOS abierto en Xcode (si se dispone de macOS).

## Nota académica

La API DummyJSON simula operaciones de escritura; las modificaciones realizadas por el cliente se mantienen en el almacenamiento local de la aplicación para permitir demostrar el flujo CRUD durante las pruebas.

La publicación efectiva en Google Play Console y App Store Connect requiere cuentas/membresías y procesos de firma propios de cada plataforma. Esta entrega prepara el proyecto para esos procesos, pero no sustituye las credenciales de publicación.

## Credenciales de demostración

No existe un backend de usuarios en esta versión académica. Se valida que el correo tenga formato de acceso y que la contraseña tenga al menos cuatro caracteres. Para la evidencia puede utilizarse:

Correo: usuario@shopapp.com
Contraseña: 123456
