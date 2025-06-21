import './App.css';
import { Button, Container, Box } from '@mui/material';
import DataTable from './DataTable';

function App() {
    return (
        <Container maxWidth="md" style={{ textAlign: 'center', paddingTop: '2rem' }}>
            <Button variant="contained" color="success">
                Получить данные
            </Button>

            <Box mt={4}>
                <DataTable items={
                    [
                        { name: 'Товар 1', count: 1, description: 'Описание строки 1' },
                        { name: 'Товар 2', count: 2, description: 'Описание строки 2' },
                        { name: 'Товар 3', count: 3, description: 'Описание строки 3' },
                    ]
                }/>
            </Box>
        </Container>
    );
}

export default App
