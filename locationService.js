// Serviço para validação de CEP e busca por localização

export const validateCEP = async (cep) => {
  // Remove caracteres não numéricos
  const cleanCEP = cep.replace(/\D/g, '')
  
  // Verifica se tem 8 dígitos
  if (cleanCEP.length !== 8) {
    throw new Error('CEP deve ter 8 dígitos')
  }
  
  try {
    const response = await fetch(`https://viacep.com.br/ws/${cleanCEP}/json/`)
    const data = await response.json()
    
    if (data.erro) {
      throw new Error('CEP não encontrado')
    }
    
    return {
      cep: data.cep,
      logradouro: data.logradouro,
      bairro: data.bairro,
      localidade: data.localidade,
      uf: data.uf,
      coordinates: await getCoordinates(data.localidade, data.uf)
    }
  } catch (error) {
    throw new Error('Erro ao validar CEP: ' + error.message)
  }
}

// Função para obter coordenadas aproximadas (simulada)
const getCoordinates = async (cidade, uf) => {
  // Coordenadas aproximadas de algumas cidades principais
  const cityCoordinates = {
    'São Paulo': { lat: -23.5505, lng: -46.6333 },
    'Rio de Janeiro': { lat: -22.9068, lng: -43.1729 },
    'Belo Horizonte': { lat: -19.9167, lng: -43.9345 },
    'Salvador': { lat: -12.9714, lng: -38.5014 },
    'Brasília': { lat: -15.7942, lng: -47.8822 },
    'Curitiba': { lat: -25.4284, lng: -49.2733 },
    'Recife': { lat: -8.0476, lng: -34.8770 },
    'Porto Alegre': { lat: -30.0346, lng: -51.2177 },
    'Manaus': { lat: -3.1190, lng: -60.0217 },
    'Belém': { lat: -1.4558, lng: -48.5044 },
    'Santos': { lat: -23.9618, lng: -46.3322 }
  }
  
  return cityCoordinates[cidade] || { lat: -23.5505, lng: -46.6333 } // Default para São Paulo
}

// Função para calcular distância entre dois pontos (fórmula de Haversine)
const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371 // Raio da Terra em km
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng/2) * Math.sin(dLng/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

// Base de dados simulada de peneiras
const peneirasDatabase = [
  {
    id: 1,
    clube: "Santos FC",
    categoria: "Sub-17",
    data: "15/02/2025",
    horario: "14:00",
    local: "CT Rei Pelé - Santos, SP",
    endereco: "Santos, SP",
    coordinates: { lat: -23.9618, lng: -46.3322 },
    contato: "(13) 3257-4000",
    email: "peneiras@santosfc.com.br",
    descricao: "Peneira para categoria sub-17. Necessário levar documentos e atestado médico.",
    requisitos: ["Nascidos em 2008", "Atestado médico", "Documentos pessoais"]
  },
  {
    id: 2,
    clube: "Palmeiras",
    categoria: "Sub-15",
    data: "20/02/2025",
    horario: "09:00",
    local: "Academia de Futebol - São Paulo, SP",
    endereco: "São Paulo, SP",
    coordinates: { lat: -23.5505, lng: -46.6333 },
    contato: "(11) 3749-8000",
    email: "base@palmeiras.com.br",
    descricao: "Avaliação para categoria de base sub-15. Vagas limitadas.",
    requisitos: ["Nascidos em 2010", "Autorização dos pais", "Chuteira"]
  },
  {
    id: 3,
    clube: "Corinthians",
    categoria: "Sub-20",
    data: "25/02/2025",
    horario: "15:30",
    local: "CT Dr. Joaquim Grava - São Paulo, SP",
    endereco: "São Paulo, SP",
    coordinates: { lat: -23.5505, lng: -46.6333 },
    contato: "(11) 2095-3000",
    email: "peneiras@corinthians.com.br",
    descricao: "Peneira para jogadores nascidos em 2005/2006. Inscrição obrigatória.",
    requisitos: ["Nascidos em 2005/2006", "Inscrição prévia", "Experiência comprovada"]
  },
  {
    id: 4,
    clube: "São Paulo FC",
    categoria: "Profissional",
    data: "28/02/2025",
    horario: "10:00",
    local: "CT da Barra Funda - São Paulo, SP",
    endereco: "São Paulo, SP",
    coordinates: { lat: -23.5505, lng: -46.6333 },
    contato: "(11) 3670-8000",
    email: "futebol@saopaulofc.net",
    descricao: "Avaliação para elenco profissional. Apenas jogadores com experiência.",
    requisitos: ["Experiência profissional", "Vídeos de jogos", "Currículo esportivo"]
  },
  {
    id: 5,
    clube: "Flamengo RJ",
    categoria: "Sub-16",
    data: "10/03/2025",
    horario: "08:00",
    local: "Ninho do Urubu - Rio de Janeiro, RJ",
    endereco: "Rio de Janeiro, RJ",
    coordinates: { lat: -22.9068, lng: -43.1729 },
    contato: "(21) 3434-9000",
    email: "base@flamengo.com.br",
    descricao: "Peneira para categoria sub-16. Processo seletivo rigoroso.",
    requisitos: ["Nascidos em 2009", "Altura mínima 1,65m", "Atestado médico"]
  },
  {
    id: 6,
    clube: "Vasco da Gama",
    categoria: "Sub-18",
    data: "12/03/2025",
    horario: "14:30",
    local: "CT do Almirante - Rio de Janeiro, RJ",
    endereco: "Rio de Janeiro, RJ",
    coordinates: { lat: -22.9068, lng: -43.1729 },
    contato: "(21) 2198-7000",
    email: "peneiras@vasco.com.br",
    descricao: "Avaliação técnica para categoria sub-18.",
    requisitos: ["Nascidos em 2007", "Experiência em competições", "Documentos"]
  },
  {
    id: 7,
    clube: "Grêmio",
    categoria: "Sub-19",
    data: "18/03/2025",
    horario: "09:30",
    local: "CT Luiz Carvalho - Porto Alegre, RS",
    endereco: "Porto Alegre, RS",
    coordinates: { lat: -30.0346, lng: -51.2177 },
    contato: "(51) 3358-4000",
    email: "base@gremio.net",
    descricao: "Peneira para formação de elenco sub-19.",
    requisitos: ["Nascidos em 2006", "Experiência em clubes", "Recomendação"]
  },
  {
    id: 8,
    clube: "Internacional",
    categoria: "Sub-14",
    data: "22/03/2025",
    horario: "15:00",
    local: "CT Parque Gigante - Porto Alegre, RS",
    endereco: "Porto Alegre, RS",
    coordinates: { lat: -30.0346, lng: -51.2177 },
    contato: "(51) 3230-4600",
    email: "peneiras@internacional.com.br",
    descricao: "Captação de talentos para categoria sub-14.",
    requisitos: ["Nascidos em 2011", "Autorização dos pais", "Atestado médico"]
  }
]

// Função principal para buscar peneiras por localização
export const searchPeneiras = async (searchTerm) => {
  try {
    let userLocation
    
    // Verifica se é um CEP ou endereço
    if (/^\d{5}-?\d{3}$/.test(searchTerm.replace(/\D/g, ''))) {
      // É um CEP
      userLocation = await validateCEP(searchTerm)
    } else {
      // É um endereço/cidade
      userLocation = {
        localidade: searchTerm,
        coordinates: await getCoordinates(searchTerm, 'SP') // Default SP
      }
    }
    
    // Calcula distância para cada peneira e ordena por proximidade
    const peneirasWithDistance = peneirasDatabase.map(peneira => {
      const distance = calculateDistance(
        userLocation.coordinates.lat,
        userLocation.coordinates.lng,
        peneira.coordinates.lat,
        peneira.coordinates.lng
      )
      
      return {
        ...peneira,
        distancia: `${distance.toFixed(1)} km`
      }
    })
    
    // Ordena por distância (mais próximas primeiro)
    peneirasWithDistance.sort((a, b) => 
      parseFloat(a.distancia) - parseFloat(b.distancia)
    )
    
    return {
      location: userLocation,
      peneiras: peneirasWithDistance
    }
    
  } catch (error) {
    throw new Error('Erro na busca: ' + error.message)
  }
}

// Função para buscar peneiras por filtros
export const filterPeneiras = (peneiras, filters) => {
  return peneiras.filter(peneira => {
    if (filters.categoria && peneira.categoria !== filters.categoria) {
      return false
    }
    if (filters.maxDistance && parseFloat(peneira.distancia) > filters.maxDistance) {
      return false
    }
    if (filters.clube && !peneira.clube.toLowerCase().includes(filters.clube.toLowerCase())) {
      return false
    }
    return true
  })
}

