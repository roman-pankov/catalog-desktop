import './App.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Container, Box, CircularProgress, Typography } from '@mui/material';
import {DataTable, Item} from './DataTable';

function App() {
    const [response, setResponse] = useState<Item[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);


    const handleRequest = async () => {
        setLoading(true);
        setError(null);

        const rawJsons = [
            `{"jsonrpc":"2.0","protocol":7,"method":"Nomenclature.List","params":{...`, // большой JSON для раздела 1
            `{"jsonrpc":"2.0","protocol":7,"method":"Nomenclature.List","params":{...`, // большой JSON для раздела 2
        ];
        const url = 'https://my-pos-system.ru/service/?x_version=25.2141-108.3';


        try {
            const responses = await Promise.all(
                rawJsons.map((json) =>
                    axios.post(url, json, {
                        headers: {
                            'Content-Type': 'application/json; charset=UTF-8',
                            'Cookie' : 'lang=ru; region=RU;', // ... много кук, в т.ч. для аутентификации
                        },
                    })
                )
            );

            // Объединяем данные result.d из каждого ответа
            const allData: Item[] = responses.flatMap(res => res.data);

            // Оборачиваем в один объект, чтобы DataTable работала, как раньше
            setResponse(allData);
        } catch (err: any) {
            setError(err.message || 'Ошибка запроса');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Первый вызов сразу при загрузке
        handleRequest();
    }, []);

    return (
        <Container maxWidth="md" style={{ textAlign: 'center', paddingTop: '2rem' }}>
            <Button variant="contained" color="success">
                Получить данные
            </Button>

            <Box mt={4}>
                {loading && <CircularProgress />}
                {error && <Typography color="error">Ошибка: {error}</Typography>}
                {response && <DataTable items={response}/>}
            </Box>
        </Container>
    );
}

export default App
