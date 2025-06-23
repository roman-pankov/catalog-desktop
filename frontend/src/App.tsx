import './App.css';
import { useState, useEffect } from 'react';
import { Button, Container, Box, CircularProgress, Typography } from '@mui/material';
import {DataTable, Item} from './DataTable';

interface ProxyRequest {
    url: string;
    method: string;
    headers: Record<string, string>;
    body: any;
}

interface ProxyResponse {
    data: string;
    statusCode: number;
    error?: string;
}

async function proxyRequest(url: string, data: any, headers: Record<string, string>) {
    const proxyReq: ProxyRequest = {
        url: url,
        method: 'POST',
        headers: headers,
        body: data
    };

    try {
        const response: ProxyResponse = await (window as any).go.main.App.ProxyHTTPRequest(proxyReq);

        if (response.error) {
            throw new Error(response.error);
        }

        // Парсим JSON ответ
        const jsonData = JSON.parse(response.data);

        // Возвращаем объект в формате axios response
        return {
            data: jsonData,
            status: response.statusCode,
            statusText: response.statusCode === 200 ? 'OK' : 'Error'
        };
    } catch (error: any) {
        throw new Error(`Proxy request failed: ${error.message}`);
    }
}

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
                    proxyRequest(url, json, {
                        'Content-Type': 'application/json; charset=UTF-8',
                        'Cookie': 'lang=ru; region=RU;', // ... много кук, в т.ч. для аутентификации
                    })
                )
            );

            // Объединяем данные из каждого ответа
            const allData: Item[] = responses.flatMap(res => res.data.data);

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

        // Интервал 5 минут (300000 мс)
        const intervalId = setInterval(() => {
            handleRequest();
        }, 5*60*1000);

        // Очистка интервала при размонтировании
        return () => clearInterval(intervalId);
    }, []);

    return (
        <Container maxWidth="md" style={{ textAlign: 'center', paddingTop: '2rem' }}>
            <Button variant="contained" color="success" onClick={handleRequest}>
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
