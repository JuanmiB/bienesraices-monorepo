# 🤝 Guía de Contribución

¡Gracias por tu interés en contribuir a este proyecto! Toda ayuda es bienvenida.

## 📋 Tabla de Contenidos

- [Código de Conducta](#código-de-conducta)
- [¿Cómo puedo contribuir?](#cómo-puedo-contribuir)
- [Proceso de Pull Request](#proceso-de-pull-request)
- [Guías de Estilo](#guías-de-estilo)
- [Estructura de Commits](#estructura-de-commits)
- [Reportar Bugs](#reportar-bugs)
- [Sugerir Features](#sugerir-features)

---

## 📜 Código de Conducta

Este proyecto se adhiere a un código de conducta. Al participar, se espera que mantengas un ambiente respetuoso y colaborativo.

---

## 🚀 ¿Cómo puedo contribuir?

### 1. Reportar Bugs
- Usa la [página de issues](../../issues)
- Verifica que el bug no haya sido reportado antes
- Incluye pasos detallados para reproducirlo
- Agrega screenshots si es posible

### 2. Sugerir Mejoras
- Abre un issue con el tag `enhancement`
- Explica claramente el problema que resuelve
- Describe la solución propuesta

### 3. Contribuir Código
- Revisa los [issues abiertos](../../issues)
- Busca issues con el tag `good first issue` si es tu primera contribución
- Comenta en el issue que quieres trabajar en él
- Haz fork del repositorio
- Crea una rama para tu feature
- Envía un Pull Request

---

## 🔄 Proceso de Pull Request

1. **Fork y clona el repositorio**
   ```bash
   git clone https://github.com/TU-USUARIO/02-bienesraices-react.git
   cd 02-bienesraices-react
   ```

2. **Crea una rama para tu feature**
   ```bash
   git checkout -b feature/mi-nueva-feature
   ```

3. **Haz tus cambios**
   - Escribe código limpio y bien documentado
   - Sigue las guías de estilo del proyecto
   - Agrega tests si es necesario

4. **Commit tus cambios**
   ```bash
   git add .
   git commit -m "feat: agrega nueva funcionalidad X"
   ```

5. **Push a tu fork**
   ```bash
   git push origin feature/mi-nueva-feature
   ```

6. **Abre un Pull Request**
   - Ve a la página del repositorio original
   - Click en "New Pull Request"
   - Selecciona tu rama
   - Completa la descripción del PR

### ✅ Checklist del Pull Request

- [ ] El código sigue las guías de estilo del proyecto
- [ ] Los cambios no generan nuevos warnings
- [ ] Se agregaron tests (si aplica)
- [ ] Todos los tests pasan
- [ ] El build funciona correctamente
- [ ] Se actualizó la documentación (si aplica)
- [ ] El commit message sigue la convención

---

## 🎨 Guías de Estilo

### JavaScript/React

```javascript
// ✅ BIEN
const MyComponent = ({ title, description }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="container">
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  );
};

// ❌ MAL
function mycomponent(props) {
  var open = false;

  return <div><h1>{props.title}</h1></div>;
}
```

### Reglas Importantes

1. **Componentes en PascalCase**
   ```javascript
   // ✅ Bien
   const UserProfile = () => { }

   // ❌ Mal
   const userProfile = () => { }
   ```

2. **Variables y funciones en camelCase**
   ```javascript
   // ✅ Bien
   const userName = "Juan";
   const handleSubmit = () => { }

   // ❌ Mal
   const user_name = "Juan";
   const HandleSubmit = () => { }
   ```

3. **Constantes en UPPER_SNAKE_CASE**
   ```javascript
   // ✅ Bien
   const API_URL = "http://localhost:3000";
   const MAX_ITEMS = 100;
   ```

4. **Destructuring de props**
   ```javascript
   // ✅ Bien
   const Card = ({ title, description, image }) => { }

   // ❌ Evitar
   const Card = (props) => {
     return <div>{props.title}</div>;
   }
   ```

5. **Early returns**
   ```javascript
   // ✅ Bien
   const Component = ({ items }) => {
     if (!items || items.length === 0) {
       return <p>No hay items</p>;
     }

     return <div>{items.map(...)}</div>;
   };
   ```

### CSS/Tailwind

- Usa Tailwind utilities cuando sea posible
- Ordena las clases: layout → display → spacing → typography → effects
- Usa responsive prefixes: `sm:`, `md:`, `lg:`

```jsx
// ✅ Bien ordenado
<div className="flex flex-col gap-4 p-6 rounded-lg bg-white shadow-md hover:shadow-lg transition">

// ❌ Desordenado
<div className="shadow-md bg-white gap-4 flex p-6 hover:shadow-lg flex-col rounded-lg transition">
```

---

## 📝 Estructura de Commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/)

### Formato

```
<tipo>(<scope>): <descripción>

[cuerpo opcional]

[footer opcional]
```

### Tipos

- `feat`: Nueva funcionalidad
- `fix`: Corrección de bug
- `docs`: Cambios en documentación
- `style`: Formateo, espacios, etc (no afecta funcionalidad)
- `refactor`: Refactorización de código
- `perf`: Mejoras de performance
- `test`: Agregar o corregir tests
- `chore`: Tareas de mantenimiento

### Ejemplos

```bash
# Nueva feature
git commit -m "feat: agrega sistema de favoritos"
git commit -m "feat(auth): implementa recuperación de contraseña"

# Bug fix
git commit -m "fix: corrige loop infinito en búsqueda"
git commit -m "fix(gallery): resuelve navegación con teclado"

# Documentación
git commit -m "docs: actualiza README con instrucciones de deploy"

# Refactor
git commit -m "refactor: simplifica lógica de filtros"

# Performance
git commit -m "perf: implementa lazy loading en imágenes"

# Tests
git commit -m "test: agrega tests unitarios para SearchToolbar"
```

---

## 🐛 Reportar Bugs

### Antes de reportar

1. Busca en [issues existentes](../../issues)
2. Verifica que estés usando la última versión
3. Reproduce el bug en un entorno limpio

### Template de Bug Report

```markdown
**Descripción del Bug**
Una descripción clara del problema.

**Pasos para Reproducir**
1. Ve a '...'
2. Click en '...'
3. Scroll hasta '...'
4. Ver error

**Comportamiento Esperado**
Lo que debería pasar.

**Comportamiento Actual**
Lo que actualmente pasa.

**Screenshots**
Si aplica, agrega screenshots.

**Entorno**
- OS: [e.g. macOS 14.0]
- Navegador: [e.g. Chrome 120]
- Versión: [e.g. 1.0.0]

**Información Adicional**
Contexto adicional del problema.
```

---

## 💡 Sugerir Features

### Template de Feature Request

```markdown
**¿El feature resuelve un problema?**
Una descripción clara del problema. Ej: "Siempre me frustra cuando [...]"

**Solución Propuesta**
Una descripción clara de lo que quieres que pase.

**Alternativas Consideradas**
Otras soluciones o features que has considerado.

**Información Adicional**
Screenshots, mockups, ejemplos de otras apps, etc.
```

---

## 🧪 Testing

Antes de enviar tu PR, asegúrate de:

```bash
# Frontend
cd front
npm run build       # Debe completar sin errores
npm run lint        # No debe haber errores críticos

# Backend
cd back
npm test            # Si hay tests configurados
npm start           # Servidor debe iniciar sin errores
```

---

## 📞 Preguntas

Si tienes preguntas sobre cómo contribuir:

- Abre un issue con el tag `question`
- Contáctame por [email](mailto:tu.email@ejemplo.com)
- Únete a las [Discussions](../../discussions)

---

## 🙏 Reconocimientos

Todos los contribuidores serán reconocidos en el README del proyecto.

---

**¡Gracias por contribuir! 🎉**
