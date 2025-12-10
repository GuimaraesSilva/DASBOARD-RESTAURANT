import { Client } from '@/types/clients';

interface TopClientsProps {
  clients: Client[];
}

export function TopClients({ clients }: TopClientsProps) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h2 className="text-xl font-bold mb-4 text-[#3C3838]">Top Clientes</h2>
      <div className="space-y-3">
        {clients.map((client, index) => (
          <div
            key={index}
            className="bg-[#D4C5BE] rounded-lg p-4 flex items-center justify-between hover:bg-[#A8978E] transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="bg-[#2C3A2B] text-white rounded-full w-12 h-12 flex items-center justify-center font-semibold">
                {client.initials}
              </div>
              <div>
                <h3 className="font-semibold text-[#3C3838]">{client.name}</h3>
                <p className="text-sm text-[#3C3838]/70">{client.email}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-[#2C3A2B]">{client.visits}</p>
              <p className="text-sm text-[#3C3838]/70">visitas</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}