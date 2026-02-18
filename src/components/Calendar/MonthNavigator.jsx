import React from 'react';
import { Paper, Box, IconButton, Typography } from '@mui/material';
import { 
    ChevronLeft as PrevIcon, 
    ChevronRight as NextIcon,
    Today as TodayIcon 
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const StyledNavigator = styled(Paper)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(2),
    marginBottom: theme.spacing(3),
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
}));

const MonthNavigator = ({ currentMonth, onPrevMonth, onNextMonth, onToday }) => {
    const monthName = currentMonth.format('MMMM');
    const year = currentMonth.format('YYYY');

    return (
    <StyledNavigator elevation={4}>
        <IconButton onClick={onPrevMonth} sx={{ color: 'white' }}>
        <PrevIcon />
        </IconButton>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', textTransform: 'capitalize' }}>
            {monthName} {year}
        </Typography>
        <IconButton onClick={onToday} sx={{ color: 'white' }} size="small">
            <TodayIcon />
        </IconButton>
        </Box>

        <IconButton onClick={onNextMonth} sx={{ color: 'white' }}>
        <NextIcon />
        </IconButton>
    </StyledNavigator>
    );
};

export default MonthNavigator;