import p from "npm:pyodide@0.29.0/pyodide.js"

const pyodide = await p.loadPyodide()
await pyodide.loadPackage("networkx")

const template =
(ss: TemplateStringsArray, ...vs: unknown[]) =>
    ss.reduce((a, b, i) => a+vs[i-1]+b)

const $ =
(ss: TemplateStringsArray, ...vs: unknown[]) => {
    const res = pyodide.runPython(template(ss, ...vs))
    try {
        return res.toJs()
    } catch {
        return res
    }
}

const $f =
(ss: TemplateStringsArray, ...vs: unknown[]) =>
(...args: unknown[]) => {
    const res = pyodide.globals.get(template(ss, ...vs))(...args)
    try {
        return res.toJs()
    } catch {
        return res
    }
}

$`
    import networkx as nx
    import numpy as np

    def graph6(s):
        return nx.to_numpy_array(nx.from_graph6_bytes(s.encode()))

    def adjmat(m):
        m = np.array(m.to_py())
        return nx.to_graph6_bytes(
            nx.from_numpy_array(m),
            header=False,
        ).decode()
`

export const graph6 = $f`graph6`
export const adjmat = $f`adjmat`
