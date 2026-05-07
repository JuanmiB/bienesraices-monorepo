import { useQuery } from '@tanstack/react-query';
import { getPropertyTypes } from '../services';

export const propertyTypesQueryKey = ['property-types'];

export const usePropertyTypes = () =>
  useQuery({
    queryKey: propertyTypesQueryKey,
    queryFn: getPropertyTypes,
    staleTime: Infinity,
    gcTime: Infinity,
  });
