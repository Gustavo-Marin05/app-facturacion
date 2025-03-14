para probar el proyecto puedes optar por descargar el archivo en zip o simplemente clonarlo
```sh
git clone https://github.com/Gustavo-Marin05/app-facturacion.git
```

la version de node que se esta usando es el 22.14.0

---
para poder intalar todas las dependencias 

```sh
npm install
```

despues de poder instalar todas las dependencias 
con el siguiente comando se ejecutara el proyecto o programa
```sh
npm run dev
```

---

(importante )
si es que por si acaso no da algo sobre la base de datos ingresar el siguiente comando
```sh
npx prisma db push
```


---
para actualizar tu proyecto clonado con los cambios que se hicieron recientementes
```sh
git pull origin main

```

---
(opcional)  ya que estamos usando el orm de prisma podemos aprovechar su studio para fijarnos la tablas de base de datos
con el siguinte comando

```sh
npx prisma studio
```
