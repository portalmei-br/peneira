import React, { useState } from 'react'
import './App.css'
import { Search, MapPin, Clock, Users, Star, Phone, Mail, CheckCircle, Target, Trophy, Calendar, AlertCircle } from 'lucide-react'
import { Button } from './components/ui/button'
import { Input } from './components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card'
import { Badge } from './components/ui/badge'
import { Alert, AlertDescription } from './components/ui/alert'
import { searchPeneiras } from './services/locationService'
import heroImage from './assets/hero_peneira.jpeg'
import comoFuncionaImage from './assets/como_funciona.jpg'
import depoimentosImage from './assets/depoimentos.jpg'

function App() {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [error, setError] = useState('')
  const [userLocation, setUserLocation] = useState(null)

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setError('Por favor, digite um CEP ou endereço')
      return
    }
    
    setIsLoading(true)
    setError('')
    setHasSearched(true)
    
    try {
      const result = await searchPeneiras(searchTerm)
      setSearchResults(result.peneiras)
      setUserLocation(result.location)
    } catch (err) {
      setError(err.message)
      setSearchResults([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header/Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 hero-overlay" />
        
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            Encontre Peneiras de Futebol
            <span className="block text-yellow-400">Perto de Você</span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 opacity-90 animate-fade-in-delay">
            Descubra oportunidades únicas para mostrar seu talento no futebol
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto mb-8">
            <Input
              type="text"
              placeholder="Digite seu CEP ou endereço..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 h-14 text-lg px-6 bg-white/90 backdrop-blur-sm border-0 focus:ring-2 focus:ring-yellow-400"
            />
            <Button 
              onClick={handleSearch}
              disabled={isLoading}
              className="search-button h-14 px-8 text-lg font-semibold text-white border-0"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Buscando...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Buscar Peneiras
                </div>
              )}
            </Button>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 text-sm opacity-80">
            <div className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4" />
              Peneiras verificadas
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              Busca por localização
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              Informações atualizadas
            </div>
          </div>
        </div>
      </section>

      {/* Resultados da Busca */}
      {hasSearched && (
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            {error ? (
              <div className="text-center">
                <Alert className="max-w-md mx-auto mb-8">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
                <Button onClick={() => setHasSearched(false)} variant="outline">
                  Tentar novamente
                </Button>
              </div>
            ) : (
              <>
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold mb-4">
                    {searchResults.length > 0 ? `${searchResults.length} peneiras encontradas` : 'Nenhuma peneira encontrada'}
                  </h2>
                  {userLocation && (
                    <p className="text-gray-600">
                      Buscando próximo a: {userLocation.localidade}, {userLocation.uf}
                    </p>
                  )}
                </div>
                
                {searchResults.length > 0 && (
                  <div className="grid gap-6 md:grid-cols-2">
                    {searchResults.map((peneira) => (
                      <Card key={peneira.id} className="peneira-card bg-white shadow-lg">
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-xl text-primary">{peneira.clube}</CardTitle>
                              <CardDescription className="text-lg font-medium">{peneira.categoria}</CardDescription>
                            </div>
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              {peneira.distancia}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span>{peneira.data} às {peneira.horario}</span>
                          </div>
                          
                          <div className="flex items-center gap-2 text-gray-600">
                            <MapPin className="w-4 h-4" />
                            <span>{peneira.local}</span>
                          </div>
                          
                          <p className="text-gray-700">{peneira.descricao}</p>
                          
                          {peneira.requisitos && (
                            <div className="bg-blue-50 p-3 rounded-lg">
                              <h4 className="font-semibold text-sm text-blue-800 mb-2">Requisitos:</h4>
                              <ul className="text-sm text-blue-700 space-y-1">
                                {peneira.requisitos.map((req, index) => (
                                  <li key={index} className="flex items-center gap-2">
                                    <CheckCircle className="w-3 h-3" />
                                    {req}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          <div className="flex flex-col gap-2 pt-4 border-t">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Phone className="w-4 h-4" />
                              <span>{peneira.contato}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Mail className="w-4 h-4" />
                              <span>{peneira.email}</span>
                            </div>
                          </div>
                          
                          <Button className="w-full mt-4 bg-primary hover:bg-primary/90">
                            Demonstrar Interesse
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      )}

      {/* Seção de Benefícios */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Por que usar nossa plataforma?</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="card-hover text-center">
              <CardContent className="pt-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Busca Precisa</h3>
                <p className="text-gray-600">Encontre peneiras próximas ao seu endereço com precisão</p>
              </CardContent>
            </Card>
            
            <Card className="card-hover text-center">
              <CardContent className="pt-8">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Peneiras Verificadas</h3>
                <p className="text-gray-600">Todas as oportunidades são verificadas e atualizadas</p>
              </CardContent>
            </Card>
            
            <Card className="card-hover text-center">
              <CardContent className="pt-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Informações Completas</h3>
                <p className="text-gray-600">Data, horário, local e contato de cada peneira</p>
              </CardContent>
            </Card>
            
            <Card className="card-hover text-center">
              <CardContent className="pt-8">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Oportunidades Únicas</h3>
                <p className="text-gray-600">Acesso a peneiras de clubes profissionais e amadores</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Como Funciona</h2>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl">1</div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Digite seu CEP ou endereço</h3>
                  <p className="text-gray-600">Informe sua localização para encontrarmos as peneiras mais próximas</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl">2</div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Veja peneiras próximas</h3>
                  <p className="text-gray-600">Visualize todas as oportunidades disponíveis na sua região</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl">3</div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Escolha e se inscreva</h3>
                  <p className="text-gray-600">Selecione a peneira ideal e entre em contato com o clube</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl">4</div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Compareça e mostre seu talento</h3>
                  <p className="text-gray-600">Vá até o local e demonstre suas habilidades no futebol</p>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <img 
                src={comoFuncionaImage} 
                alt="Como funciona" 
                className="rounded-lg shadow-lg w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Histórias de Sucesso</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="card-hover">
              <CardContent className="pt-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "Encontrei uma peneira do meu time do coração através da plataforma. Hoje faço parte da categoria de base!"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">João Silva</p>
                    <p className="text-sm text-gray-500">Sub-17, Santos FC</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="card-hover">
              <CardContent className="pt-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "A plataforma me ajudou a encontrar várias oportunidades. Consegui uma vaga no time profissional!"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">Maria Santos</p>
                    <p className="text-sm text-gray-500">Profissional, Palmeiras</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="card-hover">
              <CardContent className="pt-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "Excelente ferramenta! Informações sempre atualizadas e contatos diretos com os clubes."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">Pedro Costa</p>
                    <p className="text-sm text-gray-500">Sub-20, Corinthians</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Peneiras de Futebol</h3>
              <p className="text-gray-400">
                Conectando talentos às melhores oportunidades do futebol brasileiro.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Links Úteis</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Como Funciona</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Clubes Parceiros</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Dicas para Peneiras</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Suporte</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Central de Ajuda</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contato</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Termos de Uso</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacidade</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Contato</h4>
              <div className="space-y-2 text-gray-400">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>(11) 9999-9999</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>contato@peneirasdefutebol.com.br</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Peneiras de Futebol. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App

