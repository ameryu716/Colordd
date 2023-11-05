// import "./app.css";
import "./scss/reset.scss";
import "./scss/common.scss";
import "toastify-js/src/toastify.css";
import Home from "./Home.svelte";

const app = new Home({
    target: document.getElementById("app"),
});

export default app;
