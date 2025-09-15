import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor() { }

  /**
   * Simula o processamento de um pagamento com cartão de crédito.
   * @param amount O valor total da compra.
   * @returns Retorna uma promessa que resolve com um objeto de sucesso ou falha.
   */
  async processPayment(amount: number): Promise<{ success: boolean; message: string }> {

    console.log('Iniciando processamento de pagamento fictício...');
    console.log(`Valor a ser processado: R$ ${amount.toFixed(2)}`);
    await new Promise(resolve => setTimeout(resolve, 2000));

    if (amount > 5000) {
        return { success: false, message: 'Limite do cartão excedido. Tente outro cartão ou reduza o valor da compra.' };
    }

    return { success: true, message: 'Pagamento aprovado com sucesso!' };
  }
}