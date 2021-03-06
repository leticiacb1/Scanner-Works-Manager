import React, { useState } from 'react';

import { View } from 'react-native';
import { Card , Paragraph, Caption, Portal, Text, Button, Snackbar, TextInput, FAB, IconButton} from 'react-native-paper';

import { useScanner } from '../lib';

import { useSignal, useRequest, useEmit,useGlobal, useEffect } from '../lib';
import settings from '../settings.json';

import styles from '../styles/Consulta.json';

export default function Consulta(props) {
    
    const { navigation, route } = props;

    const [id, setId] = useGlobal('id');
    const [data, setData] = useGlobal('data');
    const [error, setError] = useState(false);

    const { scanner, Preview } = useScanner();

    function onBarCodeScanned(result) {
        setData(setId(result.data));
        scanner.deactivate();
    }

    function onPress() {
        setError(true);
        scanner.activate();
    }

    function visualizar(){
        navigation.navigate('Informações', route);
    }

    return (

        <View style={styles.container}>
            <>
            {scanner.active ? (
                <Portal>
                    <Preview style={styles.preview} onBarCodeScanned={onBarCodeScanned} />
                </Portal>
            ) : (
                <View style={styles.scan}>
                    {!!data && (
                        <Text style={styles.buttonScan}>
                            {data}
                        </Text>
                    )}
                    <Button style={styles.buttonScan} mode="outlined" onPress={onPress} >
                        Escanear
                    </Button>
                </View>
            )}
            {scanner.broken && (
                <Snackbar visible={error} action={{ label: 'Ok', onPress: () => setError(false) }} onDismiss={() => { }}>
                    Não foi possível acessar a câmera.
                </Snackbar>
            )}
        </>

            <View style = {styles.texto}>
                <Caption style={styles.textoAuxiliar}>
                    Centralize o QRCode clicando em ESCANEAR ou digtite o ID no campo de texto.
                </Caption>
            </View>

            <Card style = {styles.card}>
                <TextInput  style={styles.input} label = "Digite ID" value={id} onChangeText={setId}></TextInput>
            </Card>
            <View style = {styles.buttons}>
                <Button mode="contained" onPress={visualizar}> Visualizar </Button>
            </View>

        </View>
    );
}
