'use client'
import { useEffect, useState } from "react";
interface Module {
  modnam: string;
  numsec?: number;
}

interface UserData {
  numsec: number;
  r911mod: Module[];
  dattim: string;
  appusr: string;
  usrnam: string;
  comnam: string;
  appnam: string;
  appknd?: string;
  idinst?: string | number;
}

interface Datas {
  dateUpdate: string;
  users: UserData[];
}

export default function Home() {
  const [isLoading, setLoading] = useState(true)
  const [datas, setDatas] = useState<Datas | null>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setLoading(true);
      // Fetch data from the API
      fetch('http://localhost:3000/api/sapiens', {
        cache: 'no-store', // Disable caching to ensure fresh data on each request
      })
      .then((response) => response.json())
      .then((data) => {
        setDatas(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
    }, 10000); // 10 seconds interval
    // Cleanup function to clear the interval
    return () => {
      clearInterval(interval);
    };
  }, []);

  if (!Array.isArray(datas?.users)) {
    console.error('Invalid data format:', datas);
    // Handle the error or return a fallback UI
    return <div className="flex h-screen flex-col items-center justify-center text-4xl">Erro ao carregar dados</div>

  }

  function convertDate(dateTime: string) {

    const serialNumber = parseFloat(dateTime)

    function excelSerialToDate(serial: number): Date {
      const excelEpoch = new Date(1899, 11, 30); // O Excel começa em 30/12/1899
      const millisecondsPerDay = 24 * 60 * 60 * 1000;
      return new Date(excelEpoch.getTime() + serial * millisecondsPerDay);
    }

    const date = excelSerialToDate(serialNumber);

    const formattedDate = date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    return formattedDate
  }

  function getModuleName(modules: Module[]) {
    if (modules.length === 0) {
      return "Livre";
    }

    const moduleNames = modules.map(mod => {
      switch (mod.modnam) {
        case "S": return "Suprimentos";
        case "R": return "Mercado";
        case "F": return "Financeiro";
        case "C": return "Contábil";
        default: return mod.modnam;
      }
    });

    return moduleNames.join(" / ");
  }

  // crie uma função para contar quantos usuarios estão no módulo suprimentos
  function countSuprimentos(users: UserData[]) {
    let count = 0;
    users.forEach(user => {
      if (user.r911mod.some(mod => mod.modnam === "S")) {
        count++;
      }
    });
    return count;
  }

  const moduleCount = countSuprimentos(datas.users);

  if (isLoading) return <p className="flex h-screen flex-col items-center justify-center text-4xl">Aguarde! Carregando...</p>;
  if (!datas) return <p className="flex h-screen flex-col items-center justify-center text-4xl">No profile data</p>;

  return (
    <div className="">
      <main className="flex flex-col gap-8 text-white justify-center items-center py-4">
        <h1 className="text-2xl">Monitoramento Usuários do Sapiens</h1>
        <div className="flex justify-start w-full pl-[12.5%] text-xl">
          <table className="text-white w-10/12 border-2 border-cyan-50" >
            <tr>
              <td className="border-x-2 w-[190px] p-2">{`Hoje é: ${datas.dateUpdate}`}</td>
              <td className="border-x-2 p-2">{`Total de acessos: ${datas.users.length}`}</td>
              <td className={`flex p-2 items-center justify-center ${moduleCount === 10 ? "bg-red-700 font-bold" : "bg-green-500 font-bold"}`}>{`Total de uso do modulo Suprimentos: ${moduleCount}`}</td>
            </tr>
          </table>
        </div>
        <table className="text-white w-10/12 border-2 border-cyan-50" >
          <caption className="sr-only">Usuários</caption>
          <thead className="">
            <tr className="border-cyan-50">
              <th className="w-[210px] border-x-2">MÓDULOS</th>
              <th className="w-[120px]">ID_CONEXÃO</th>
              <th className="w-[200px] border-x-2">CONNECT_SAPIENS</th>
              <th className="w-[200px] border-x-2">NAME_SERVER</th>
              <th className="w-[180px] border-x-2">CONNECT_SERVER</th>
              <th className="w-[120px] border-x-2">NAME_APP</th>
              <th className="w-[170px] border-x-2">DATA_CONEXÃO</th>
            </tr>
          </thead>
          <tbody className="">
            {datas.users.map((user) => (
              <tr key={user.numsec.toString()} className="border-2">
                <td className="border-2 items-center justify-center pl-2">{getModuleName(user.r911mod)}</td>
                <td className="flex items-center justify-center">{user.numsec.toString()}</td>
                <td className="border-2 items-center justify-center pl-2">{user.appusr}</td>
                <td className="border-2 items-center justify-center pl-2">{user.usrnam}</td>
                <td className="border-2 text-center">{user.comnam}</td>
                <td className="border-2 text-center">{user.appnam}</td>
                <td className="flex flex-col text-center items-center justify-center">{convertDate(user.dattim)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
      </footer>
    </div>
  );
}
