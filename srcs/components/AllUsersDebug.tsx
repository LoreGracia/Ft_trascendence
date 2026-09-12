'use client'

export interface DebugUser {
    id: string
    name: string
    email: string
    statsCount: number
}

export function AllUsersDebug({ users }: { users: DebugUser[] }) {
    return (
        <div className="mb-8 rounded-2xl border-2 border-red-500 bg-red-500/10 p-6">
            <div className="mb-4 rounded-lg bg-red-600 p-3 text-white">
                <p className="font-bold">🔴 DEBUG MODE - USUARIOS REGISTRADOS</p>
                <p className="text-xs text-red-100 mt-1">
                    ⚠️ ELIMINAR ESTE CONTENEDOR UNA VEZ BACKEND→DB FUNCIONE
                </p>
            </div>

            {users.length === 0 ? (
                <p className="text-red-400">No hay usuarios registrados</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-red-400">
                                <th className="text-left p-2 font-bold text-red-600">ID</th>
                                <th className="text-left p-2 font-bold text-red-600">Nombre</th>
                                <th className="text-left p-2 font-bold text-red-600">Email</th>
                                <th className="text-center p-2 font-bold text-red-600">Stats</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr
                                    key={user.id}
                                    className="border-b border-red-300 hover:bg-red-400/20"
                                >
                                    <td className="p-2 font-mono text-xs text-red-700">
                                        {user.id.slice(0, 8)}...
                                    </td>
                                    <td className="p-2 text-red-800 font-semibold">{user.name}</td>
                                    <td className="p-2 text-red-700">{user.email}</td>
                                    <td className="p-2 text-center">
                                        {user.statsCount > 0 ? (
                                            <span className="bg-green-500/20 text-green-700 px-2 py-1 rounded text-xs font-bold">
                                                {user.statsCount} registros
                                            </span>
                                        ) : (
                                            <span className="bg-yellow-500/20 text-yellow-700 px-2 py-1 rounded text-xs font-bold">
                                                Sin datos
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <p className="text-xs text-red-600 mt-4 italic">
                Total: {users.length} usuarios
            </p>
        </div>
    )
}