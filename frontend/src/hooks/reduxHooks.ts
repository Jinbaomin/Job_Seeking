import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from '../redux/store';

// Sử dụng thay cho useDispatch, có type an toàn
export const useAppDispatch: () => AppDispatch = useDispatch;
// Sử dụng thay cho useSelector, có type an toàn
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector; 