import { apiClient, ApiResponse } from '../api-client';

export interface EmergencyContact {
  id: string | number;
  name: string;
  number: string;
  icon: string;
  active: boolean;
  category?: string;
  sortOrder?: number;
}

export interface MunicipalHq {
  complexName: string;
  addressLine1: string;
  addressLine2: string;
  pinCode: string;
  epabxPhones: string;
  officialEmail: string;
  coEmail: string;
  workingHours: string;
  workingHoursNote: string;
  mapEmbedUrl: string;
}

export interface ContactsData {
  whatsappHelpline: string;
  emergencyContacts: EmergencyContact[];
  hq: MunicipalHq;
  councilMembers?: any[];
  officeContacts?: any[];
}

export interface UpdateContactsPayload {
  whatsappHelpline?: string;
  emergencyContacts?: EmergencyContact[];
  hq?: Partial<MunicipalHq>;
}

export async function getContactsData(): Promise<ContactsData> {
  try {
    const res = await apiClient.get<{
      contacts: {
        whatsappHelpline?: string;
        emergencyContacts?: EmergencyContact[];
        officeContacts?: any[];
        councilMembers?: any[];
        hq?: MunicipalHq;
      };
    }>('/contacts');

    const contacts = res.data?.contacts;

    // Map emergency contacts from dedicated array or officeContacts with category='emergency'
    let emergencyList: EmergencyContact[] = [];
    if (contacts?.emergencyContacts && Array.isArray(contacts.emergencyContacts)) {
      emergencyList = contacts.emergencyContacts.map((c, index) => ({
        id: c.id ? String(c.id) : `em-${Date.now()}-${index}`,
        name: c.name || (c as any).title || '',
        number: c.number || (c as any).phone || '',
        icon: c.icon || 'Phone',
        active: c.active !== undefined ? c.active : true,
        category: c.category || 'emergency',
        sortOrder: c.sortOrder ?? index,
      }));
    } else if (contacts?.officeContacts && Array.isArray(contacts.officeContacts)) {
      emergencyList = contacts.officeContacts
        .filter((c) => c.category === 'emergency')
        .map((c, index) => ({
          id: c.id ? String(c.id) : `em-${Date.now()}-${index}`,
          name: c.title || '',
          number: c.phone || '',
          icon: (c as any).icon || 'Phone',
          active: c.active !== undefined ? c.active : true,
          category: 'emergency',
          sortOrder: c.sortOrder ?? index,
        }));
    }

    const hqData: MunicipalHq = contacts?.hq || {
      complexName: '',
      addressLine1: '',
      addressLine2: '',
      pinCode: '',
      epabxPhones: '',
      officialEmail: '',
      coEmail: '',
      workingHours: '',
      workingHoursNote: '',
      mapEmbedUrl: '',
    };

    return {
      whatsappHelpline: contacts?.whatsappHelpline || '',
      emergencyContacts: emergencyList,
      hq: hqData,
      councilMembers: contacts?.councilMembers || [],
      officeContacts: contacts?.officeContacts || [],
    };
  } catch (err) {
    console.warn('Failed to fetch contacts from API, returning default structure:', err);
    return {
      whatsappHelpline: '',
      emergencyContacts: [],
      hq: {
        complexName: '',
        addressLine1: '',
        addressLine2: '',
        pinCode: '',
        epabxPhones: '',
        officialEmail: '',
        coEmail: '',
        workingHours: '',
        workingHoursNote: '',
        mapEmbedUrl: '',
      },
      councilMembers: [],
      officeContacts: [],
    };
  }
}

export async function updateContactsData(
  payload: UpdateContactsPayload
): Promise<ApiResponse<{ contacts: ContactsData }>> {
  return await apiClient.put<{ contacts: ContactsData }>('/contacts', payload);
}
