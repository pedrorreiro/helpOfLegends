import { useRef, useState } from "react"
import { useNavigate } from "react-router-dom";

export default function Header() {

    const invocador = useRef(null);

    const navigate = useNavigate();

    return (
        <div className="content" id="header">

            <div id="divBusca">
                <form onSubmit={(e) => {
                    e.preventDefault();
                    navigate("/" + invocador.current.value);
                }}>
                    <span style={{ fontSize: 15 + "px", fontWeight: "bold", marginBottom: "30px" }}>Nome de invocador</span><br /><br />
                    <input ref={invocador}></input>

                    <button type="submit">Buscar</button>

                </form>

            </div>



        </div>

    )
}