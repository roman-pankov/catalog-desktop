import { Table, TableBody, Box, Typography, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

export interface Item {
    name: string;
    count: number;
    description: string;
}

export function DataTable({ items }: { items: Item[] }) {
    return (
        <TableContainer component={Paper} style={{ maxWidth: 600, margin: 'auto', marginTop: 20 }}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Название</TableCell>
                        <TableCell align="right">Количество</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {items.map((item, idx) => (
                        <TableRow key={idx}>
                            <TableCell>
                                <Box>
                                    <Typography>{item.name}</Typography>
                                    <Typography variant="body2" color="textSecondary" fontSize={12}>
                                        {item.description}
                                    </Typography>
                                </Box>
                            </TableCell>
                            <TableCell align="right">{item.count}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
