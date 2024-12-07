import {
  ISaveDTO,
  IRecoverDTO,
  IInvalidateDTO,
  IInvalidatePrefixDTO,
} from '@/shared/providers/CacheProvider/dtos'

export interface ICacheProviderModel {
  save(data: ISaveDTO): Promise<void>
  recover<T>(data: IRecoverDTO): Promise<T | null>
  invalidate(data: IInvalidateDTO): Promise<void>
  invalidatePrefix(data: IInvalidatePrefixDTO): Promise<void>
}
