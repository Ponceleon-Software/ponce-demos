---


---

<h1 id="propuesta-de-folder-structure-ponce-demos">Propuesta de folder-structure ponce-demos</h1>
<h2 id="panel.js">Panel.js</h2>
<ul>
<li><strong>Control panel()</strong>:  Función que inicializa el control del panel lateral de forma reactiva</li>
</ul>
<h2 id="renderer.js">Renderer.js</h2>
<ul>
<li><strong>window.addEventListener</strong>(“DOMContentLoaded”):
<ul>
<li>ControlPanel()</li>
<li>CardsControl()</li>
</ul>
</li>
</ul>
<ul>
<li><strong>Modificador</strong>: Se encarga de modificar un componente de según su estado</li>
</ul>
<h2 id="components.js">Components.js</h2>
<ul>
<li><strong>Componente()</strong>: Encapsula funcionalidad compartida entre todos los componentes reactivos</li>
<li><strong>Lockable Switch</strong>: Toggle que ejecuta una función asíncrona según la acción enviada como parámetro</li>
</ul>
<h2 id="card.js">Card.js</h2>
<ul>
<li><strong>TarjetaConfiguracion</strong>: 	Crea una tarjeta estandar del panel</li>
<li><strong>createAllCards</strong></li>
</ul>
<h2 id="utilities.js">Utilities.js</h2>
<ul>
<li><strong>getHomeUrl()</strong></li>
<li><strong>wpRestApi()</strong></li>
<li><strong>utils</strong></li>
<li><strong>getSiblings()</strong></li>
</ul>
<h2 id="views.js">Views.js</h2>
<ul>
<li><strong>cardsControl</strong></li>
</ul>
<h2 id="folder-structure">Folder Structure</h2>
<pre><code>📦ponce-demos
 ┣ 📂assets
 ┃ ┗ 📂img
 ┃ ┃ ┗ 📜logo-ponceleon.svg
 ┣ 📂html
 ┃ ┗ 📜ponce-demos.html
 ┣ 📂js
 ┃ ┣ 📂Components
 ┃ ┃ ┣ 📜Components.js
 ┃ ┃ ┣ 📜Panel.js
 ┃ ┃ ┣ 📜Cards.js
 ┃ ┣ 📂Views
 ┃ ┃ ┣ 📜ViewsContainer.js
 ┃ ┃ ┗ 📜Views.js
 ┃ ┣ 📂Utilities
 ┃ ┃ ┣ 📜Utilities.js
 ┃ ┃ ┗ 📜Renderer.js
 ┃ ┗ 📜main.js
 ┣ 📂php
 ┃ ┣ 📜new_page.php
 ┣ 📂style
 ┃ ┣ 📜frame.css
 ┃ ┗ 📜ponce-demos.css
 ┣ 📜ponce-demos.json
 ┗ 📜ponce-demos.php
</code></pre>
<blockquote>
<p>Written with <a href="https://stackedit.io/">StackEdit</a>.</p>
</blockquote>

