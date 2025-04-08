import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import * as Animatable from 'react-native-animatable';

const APP_ID = 'SpGQaA9OA76zHpf065MNpmyDugS348RzOYDdoOSb';
const REST_API_KEY = '7PVSmVOzPQcEBtoccBE1996cPMSyrtHiHu0wWpB1';
const URL = 'https://parseapi.back4app.com/classes/Tarefa';

export default function App() {
  const [telaAtual, setTelaAtual] = useState('splash');

  useEffect(() => {
    const timeout = setTimeout(() => {
      setTelaAtual('home');
    }, 2500);
    return () => clearTimeout(timeout);
  }, []);

  return telaAtual === 'splash' ? <SplashScreen /> : <HomeScreen />;
}

function SplashScreen() {
  return (
    <View style={splashStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1B5E20" />
      <Animatable.Text animation="fadeInDown" style={splashStyles.logo} delay={300} duration={1200}>
        🌿
      </Animatable.Text>
      <Animatable.Text animation="fadeInUp" style={splashStyles.title} delay={600}>
        Bem-vindo(a) ao VerdeTarefas!
      </Animatable.Text>
    </View>
  );
}

function HomeScreen() {
  const [descricao, setDescricao] = useState('');
  const [tarefas, setTarefas] = useState([]);

  const headers = {
    'X-Parse-Application-Id': APP_ID,
    'X-Parse-REST-API-Key': REST_API_KEY,
    'Content-Type': 'application/json',
  };

  const buscarTarefas = async () => {
    try {
      const response = await fetch(URL, { headers });
      const json = await response.json();
      setTarefas(json.results);
    } catch (error) {
      console.error('Erro ao buscar tarefas:', error);
    }
  };

  const adicionarTarefa = async () => {
    if (!descricao.trim()) return;

    const novaTarefa = { descricao, concluida: false };

    try {
      await fetch(URL, {
        method: 'POST',
        headers,
        body: JSON.stringify(novaTarefa),
      });
      setDescricao('');
      buscarTarefas();
    } catch (error) {
      console.error('Erro ao adicionar tarefa:', error);
    }
  };

  const marcarComoConcluida = async (tarefa) => {
    if (tarefa.concluida) return;

    try {
      await fetch(`${URL}/${tarefa.objectId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ concluida: true }),
      });
      buscarTarefas();
    } catch (error) {
      console.error('Erro ao marcar como concluída:', error);
    }
  };

  useEffect(() => {
    buscarTarefas();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1B5E20" />
      <Text style={styles.header}>🌿 Lista de Tarefas</Text>

      <TextInput
        style={styles.input}
        placeholder="Nova tarefa..."
        placeholderTextColor="#8DB596"
        value={descricao}
        onChangeText={setDescricao}
      />

      <TouchableOpacity style={styles.button} onPress={adicionarTarefa}>
        <Text style={styles.buttonText}>Adicionar</Text>
      </TouchableOpacity>

      <FlatList
        data={tarefas}
        keyExtractor={(item) => item.objectId}
        contentContainerStyle={styles.lista}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => marcarComoConcluida(item)}>
            <View style={[styles.card, item.concluida && styles.cardConcluida]}>
              <Text style={[styles.tarefa, item.concluida && styles.tarefaConcluida]}>
                {item.concluida ? '✅' : '🌱'} {item.descricao}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const splashStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2E7D32',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    fontSize: 64,
  },
  title: {
    fontSize: 24,
    color: '#fff',
    marginTop: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1B5E20',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#ffffff',
    borderColor: '#A5D6A7',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: '#2E7D32',
    marginBottom: 10,
    shadowColor: '#A5D6A7',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  button: {
    backgroundColor: '#43A047',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#388E3C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 4,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  lista: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#C8E6C9',
    borderRadius: 10,
    padding: 15,
    marginVertical: 8,
    shadowColor: '#81C784',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  cardConcluida: {
    backgroundColor: '#E0F2F1',
    borderColor: '#A5D6A7',
  },
  tarefa: {
    fontSize: 16,
    color: '#2E7D32',
  },
  tarefaConcluida: {
    color: '#9E9E9E',
    textDecorationLine: 'line-through',
    fontStyle: 'italic',
  },
});
