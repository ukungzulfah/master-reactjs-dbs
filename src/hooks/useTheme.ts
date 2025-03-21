import { useSelector } from 'react-redux';
import { RootState } from '../store';

export const useTheme = () => {
    const { colors } = useSelector((state: RootState) => state.theme);
    return colors;
};