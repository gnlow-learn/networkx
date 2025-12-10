import p from "npm:pyodide@0.29.0/pyodide.js"

const pyodide = await p.loadPyodide()
await pyodide.loadPackage("networkx")

const $ =
(ss: TemplateStringsArray, ...vs: unknown[]) => {
    const res = pyodide.runPython(
        ss.reduce((a, b, i) => a+vs[i-1]+b)
    )
    try {
        return res.toJs()
    } catch {
        return res
    }
}

$`
    import networkx as nx
`

console.log($`
    nx.to_numpy_array(nx.from_graph6_bytes(b"CF"))
`)
