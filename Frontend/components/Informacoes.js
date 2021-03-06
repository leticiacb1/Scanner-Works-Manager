import React , { useState } from 'react';

import { View , ScrollView } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { Text, TextInput ,  Button , Caption , Snackbar, Portal, Dialog, Paragraph, HelperText, ActivityIndicator} from 'react-native-paper';

import { DropDown, DateTimePicker, useRequest , useEmit, useGlobal , useSignal, useEffect} from '../lib';

import styles from '../styles/Informacoes.json';
import settings from '../settings.json';

export default function Informacoes(props) {

    const { navigation, route } = props;
    const produto = route.params;

    const [dateScan, setDate] = useState(new Date());
    const [timeScan, setNowTime] = useState(new Date());
    const [lastDate, setLastDate] = useState(new Date());
    const [lastTime, setLastTime] = useState(new Date());
    const [movimentacao, setMovimentacao] = useState('NAO');
    const [status, setStatus] = useState('USO');
    const [tipo, setTipo] = useState('MATERIAL');
    const [id, setId] = useGlobal('id');
    const [local, setLocal] = useState('');
    const [obra, setObra] = useState('');
    const [usuario, setUsuario] = useState('');
    const [nome, setNome] = useState('');
    const [quantidadeE, setQuantidadeE] = useState('');
    const [quantidadeM, setQuantidadeM] = useState('');
    const [destino, setDestino] = useState('');
    const [observacao, setObservacao] = useState('');

    const [usuarioError,setUsuarioError] = useState(false);
    const [localError,setLocalError] = useState(false);
    const [quantidadeEError,setQuantidadeEError] = useState(false);
    const [quantidadeMError,setQuantidadeMError] = useState(false);
    const [destinoError,setDestinoError] = useState(false);

    const [getError, setGetError] = useState(false);
    const [registerError, setRegisterError] = useState(false); 
    const [removeError, setRemoveError] = useState(false);
    const [removeVisible, setRemoveVisible] = useState(false);

    const movimentacaoOpcoes = [
        { label: 'Não', value: 'NAO' },
        { label: 'Sim', value: 'SIM' },
    ];

    const statusOpcoes = [
        { label: 'Em uso', value: 'USO' },
        { label: 'Em manutencao', value: 'MANUTENCAO' },
        { label: 'Danificado', value: 'DANIFICADO' },
    ];

    const tipoOpcoes = [
        {label: 'Material', value : 'MATERIAL'},
        {label: 'Ferramenta' , value: 'FERRAMENTA'}
    ]

    const signal = useSignal('updated-product');
    const emit = useEmit('get-id');
    const emitAtualiza = useEmit('updated-product');

    const { get ,  response: getResponse , skip} = useRequest(settings.url);
    const {put, response: atualizaResponse} = useRequest(settings.url);
    const { del, response: removeResponse } = useRequest(settings.url);

    function onChangeTextUsuario(novoUsuario){
        skip({ ...getResponse.body, usuario: novoUsuario});
        helpTextUsuario(novoUsuario);
    }
    function onChangeTextQuantidadeE(novaQuantidade){
        skip({ ...getResponse.body, quantidadeE: novaQuantidade})
        helpTextQuantidadeE(novaQuantidade);
    }
    function onChangeTextStatus(novoStatus){
        skip({ ...getResponse.body, status: novoStatus})
    }
    function onChangeTextLocal(novoLocal){
        skip({ ...getResponse.body, local: novoLocal})
        helpTextLocal(novoLocal);
    }
    function onChangeTextMovimentacao(novaMovimentacao){
        emit();
        skip({ ...getResponse.body, movimentacao: novaMovimentacao})
    }
    function onChangeTextDestino(novoDestino){
        skip({ ...getResponse.body, destino: novoDestino});
        helpTextDestino(novoDestino);
    }
    function onChangeTextQuantidadeM(novaQuantidadeM){
        skip({ ...getResponse.body, quantidadeM: novaQuantidadeM});
        helpTextQuantidadeM(novaQuantidadeM);
    }
    function onChangeTextObservacoes(novaObservacao){
        skip({ ...getResponse.body, observacao: novaObservacao})
    }

    function Invalid(input) {
        return !input.trim();
    }

    function helpTextUsuario(inputUsuario){
        if(typeof inputUsuario !== 'string' || Invalid(inputUsuario)){
            setUsuarioError(true);
        }else{
            setUsuarioError(false);
        }
    }
    
    function helpTextLocal(inputLocal){
        if(typeof inputLocal !== 'string' || Invalid(inputLocal)){
            setLocalError(true);
        }else{
            setLocalError(false);
        }
    }

    function helpTextQuantidadeE(inputE){
        if(!isFinite(inputE) || Invalid(inputE)){
            setQuantidadeEError(true);
        }else{
            setQuantidadeEError(false);
        }
    }
   
    function helpTextQuantidadeM(inputM){
        if(!isFinite(inputM) || Invalid(inputM)){
            setQuantidadeMError(true);
        }else{
            setQuantidadeMError(false);
        }
    }

    function helpTextDestino(inputDestino){
        if(typeof inputDestino !== 'string' || Invalid(inputDestino)){
            setDestinoError(true);
        }else{
            setDestinoError(false);
        }
    }

    function atualiza() {
        
        setRegisterError(true);
        
        const body = {
            id:id,
            local:getResponse.body.local,
            usuario:getResponse.body.usuario,
            dateScan:dateScan,
            timeScan:timeScan,
            lastDate:dateScan,
            lastTime:timeScan,
            nome:getResponse.body.nome,
            tipo:getResponse.body.tipo,
            quantidadeE:getResponse.body.quantidadeE,
            quantidadeM:getResponse.body.quantidadeM,
            destino:getResponse.body.destino,
            status:getResponse.body.status,
            movimentacao:getResponse.body.movimentacao,
            observacao:getResponse.body.observacao
        }

        if(body.movimentacao == 'NAO'){
            body.destino = "";
            body.quantidadeM = "";
        }

        body.key = route.key;
        put('/produto',body);

    }

    function onDismissRemove() {
        setRemoveVisible(false);
    }

    function onConfirmRemove() {
        onDismissRemove();
        setRemoveError(true);
        del(`/produto?id=${id}`);
    }

    useEffect(()=>{
        setGetError(true);

        setDate(new Date());
        setNowTime(new Date());

        get('/produto?id='+id);
    }, [id, signal]) 

    useEffect(()=>{
        setRegisterError(true);

        if ((atualizaResponse.success && atualizaResponse.body !== null) || (removeResponse.success && removeResponse.body !== null)) {
            emitAtualiza()
            navigation.navigate('Histórico', route)
        }

    }, [atualizaResponse,removeResponse]) 

    return (
        
        <>
        {getResponse.running ? (
            <View style={styles.center}>
                <ActivityIndicator size="large" />
            </View>
        ) : (
            getResponse.success ? (
                getResponse.body === null || getResponse.body.length === 0 ? (
                    <View style={styles.center}>
                        <Text>
                            Nenhum produto cadastrado
                        </Text>
                    </View>
        ):(    
        
            <>
            <ScrollView>
                <SafeAreaView  style={styles.container}>
                    <View>
                        <View style = {styles.sub}>
                            <Caption  style = {styles.geral}>Geral</Caption >
                        </View>    

                        <TextInput style={styles.input} label="ID" value={id} onChangeText={setId} disabled={true}/>
                        <TextInput style={styles.input} label="Usuario" value={getResponse.body.usuario} onChangeText={onChangeTextUsuario}/>
                        { usuarioError && (
                            <HelperText style={styles.error} type="error">
                                Usuario é obrigatório.
                            </HelperText>
                        )}
                        <View style={styles.tempo}>
                            <DateTimePicker type="date" style={styles.inputDate} label="Data" value={dateScan} setValue={setDate} disabled={true}/>
                            <DateTimePicker type="time" style={styles.inputTime} label="Hora" value={timeScan} setValue={setNowTime} disabled={true}/>
                        </View>

                    </View>

                    <View>
                        <View style = {styles.sub}>
                            <Caption  style = {styles.title}>Último Registro</Caption >
                        </View>
        
                        <View style={styles.tempo}>
                            <DateTimePicker type="date" style={styles.inputDate} label="Data" value={new Date(getResponse.body.lastDate)} setValue={setLastDate} disabled={true}/>
                            <DateTimePicker type="time" style={styles.inputTime} label="Hora" value={new Date(getResponse.body.lastTime)} setValue={setLastTime} disabled={true}/>
                        </View>

                    </View>

                    <View>

                        <View style = {styles.sub}>
                            <Caption  style = {styles.title} >Informacoes sobre o item</Caption >
                        </View>

                        <TextInput style={styles.input} label="Nome" value={getResponse.body.nome} onChangeText={setNome} disabled={true}/>
                        <DropDown style={styles.input} label="Tipo" list={tipoOpcoes} value={getResponse.body.tipo} setValue={setTipo} disabled={true}/>
                        <DropDown style={styles.input} label="Status" list={statusOpcoes} value={getResponse.body.status} setValue={onChangeTextStatus} />
                        <TextInput style={styles.input} label="Quantidade em Estoque" value={getResponse.body.quantidadeE} onChangeText={onChangeTextQuantidadeE}/>
                        { quantidadeEError && (
                            <HelperText style={styles.error} type="error">
                                Quantidade em Estoque é obrigatório. Valor numérico.
                            </HelperText>
                        )}

                        <View style = {styles.sub}>
                            <Caption  style = {styles.title} >Localizaçao</Caption >
                        </View>

                        <TextInput style={styles.input} label="Localizaçao atual" value={getResponse.body.local} onChangeText={onChangeTextLocal}/>
                        { localError && (
                            <HelperText style={styles.error} type="error">
                                Local é obrigatório.
                            </HelperText>
                        )}

                        <DropDown style={styles.input} label="Movimentação" list={movimentacaoOpcoes} value={getResponse.body.movimentacao} setValue={onChangeTextMovimentacao} />

                        {getResponse.body.movimentacao == "SIM" ? (
                            <>
                                <TextInput style={styles.input} label="Destino" value={getResponse.body.destino} onChangeText={onChangeTextDestino}/>
                                { destinoError && (
                                    <HelperText style={styles.error} type="error">
                                        Destino é obrigatório.
                                    </HelperText>
                                )}

                                <TextInput style={styles.input} label="Quantidade Movimentada" value={getResponse.body.quantidadeM} onChangeText={onChangeTextQuantidadeM}/>
                                { quantidadeMError && (
                                    <HelperText style={styles.error} type="error">
                                        Quantidade movimentada é obrigatório. Valor numérico.
                                    </HelperText>
                                )}

                            </>
                        ) : (
                            <></>
                        )}
                        
                    </View>

                    <TextInput style={styles.input} label="Observações" value={getResponse.body.observacao} onChangeText={onChangeTextObservacoes}/>

                    <View style = {styles.buttons}>
                        <Button mode="outlined" onPress={() => navigation.navigate('Consulta', route)} disabled={destinoError || quantidadeMError || quantidadeEError || usuarioError || localError || getResponse.running || removeResponse.running || atualizaResponse.running} > Voltar </Button>
                        <Button mode="contained" onPress={atualiza}  loading={atualizaResponse.running} disabled={destinoError || quantidadeMError || quantidadeEError || usuarioError || localError || getResponse.running || removeResponse.running || atualizaResponse.running}> Salvar </Button>
                        <Button mode="outlined" onPress={() => setRemoveVisible(true)} loading={removeResponse.running} disabled={destinoError || quantidadeMError || quantidadeEError || usuarioError || localError || getResponse.running || removeResponse.running || atualizaResponse.running} > Apagar </Button>
                    </View>

                </SafeAreaView>
            </ScrollView>

            {!getResponse.running && !getResponse.success && (
            <Snackbar visible={getError} action={{ label: 'Ok', onPress: () => setGetError(false) }} onDismiss={() => { }}>
                {getResponse.body.status === 0 ? 'Não foi possível conectar ao servidor' : `ERROR ${getResponse.body.status}: ${getResponse.body.message}`}
            </Snackbar>
            )}

            {!atualizaResponse.running && !atualizaResponse.success && (
                <Snackbar visible={registerError} action={{ label: 'Ok', onPress: () => setRegisterError(false) }} onDismiss={() => null}>
                    {atualizaResponse.body.status === 0 ? 'Não foi possível conectar ao servidor' : `ERROR ${atualizaResponse.body.status}: ${atualizaResponse.body.message}`}
                </Snackbar>
            )}

            {!removeResponse.running && !removeResponse.success && (
                <Snackbar visible={removeError} action={{ label: 'Ok', onPress: () => setRemoveError(false) }} onDismiss={() => null}>
                    {removeResponse.body.status === 0 ? 'Não foi possível conectar ao servidor' : `ERROR ${removeResponse.body.status}: ${removeResponse.body.message}`}
                </Snackbar>
            )}

            <Portal>
                <Dialog visible={removeVisible} onDismiss={onDismissRemove}>
                    <View>
                        <Dialog.Title>
                            {`Remover ${getResponse.body.id}?`}
                        </Dialog.Title>
                        <Dialog.Content>
                            <Paragraph>
                                Esta operação não pode ser desfeita.
                            </Paragraph>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={onDismissRemove}>
                                Cancelar
                            </Button>
                            <Button onPress={onConfirmRemove}>
                                Ok
                            </Button>
                        </Dialog.Actions>
                    </View>
                </Dialog>
            </Portal>

            </>)

        ):(
            <View style={styles.center}>
                <Button mode="contained" onPress={emit}>
                    Tentar novamente
                </Button>
            </View>
           )
        
        )
      }
    </>
    );
}
