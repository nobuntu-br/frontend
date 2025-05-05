import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MaskService {
  private maskDictionary: { [key: string]: string } = {
    'CPFCNPJ': '000.000.000-00||00.000.000/0000-00',
    'CPF': '000.000.000-00',
    'CNPJ': '00.000.000/0000-00',
    'RG': '00.000.000-0||00.000.000-0',
    'CEI': '00.000.00000/00',
    'PIS': '000.00000.00-0',
    'NIS': '000.00000.00-0',
    'CBO': '0000-0',
    'SUS': '000 0000 0000 0000',
    'CRM': '0000',
    'CNH': '00000000000',
    'UF': 'AA',
    'IBGE': '0000000',
    'CEP': '00000-000',
    'PHONE': '(00) 0000-0000||(00) 0 0000-0000',
    'CELLPHONE': '(00) 00000-0000||(00) 0 00000-0000',
    'DATE': '00/00/0000',
    'HOUR': '00:00',
    'CREDIT_CARD': '0000 0000 0000 0000',
    'CREDIT_CARD_EXPIRATION': '00/00',
    'CREDIT_CARD_CVV': '000',
    'CREDIT_CARD_INSTALLMENTS': '0x',
    'CREDIT_CARD_INSTALLMENTS_NUMBER': '0',
    'CREDIT_CARD_INSTALLMENTS_VALUE': 'R$ 0,00',
    'MONEY': 'R$ 0,00',
    'PERCENTAGE': '0%',
    'WEIGHT': '0,00 kg',
    'HEIGHT': '0,00 m',
    'AREA': '0,00 m²',
    'VOLUME': '0,00 m³',
    'TEMPERATURE': '0,00 °C',
    'VELOCITY': '0,00 m/s',
    'PRESSURE': '0,00 Pa',
    'ENERGY': '0,00 J',
    'POWER': '0,00 W',
    'ELECTRIC_CURRENT': '0,00 A',
    'VOLTAGE': '0,00 V',
    'RESISTANCE': '0,00 Ω',
    'CAPACITANCE': '0,00 F',
    'INDUCTANCE': '0,00 H',
    'FREQUENCY': '0,00 Hz',
    'ILLUMINANCE': '0,00 lx',
    'RADIOACTIVITY': '0,00 Bq',
    'FORCE': '0,00 N',
  };

  constructor() { }

  getMaskPattern(maskType: string): string {
    if(!maskType) {
      return '';
    }
    return this.maskDictionary[maskType.toUpperCase()] || '';
  }
}
