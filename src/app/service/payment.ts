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
    
    // Simula um atraso de 2 segundos para o processamento, como se estivesse se comunicando com um servidor real.
    await new Promise(resolve => setTimeout(resolve, 2000));

    // A lógica de sucesso/falha fictícia.
    // O pagamento falha se o valor for maior que 5000 para simular um limite de cartão.
    if (amount > 5000) {
        return { success: false, message: 'Limite do cartão excedido. Tente outro cartão ou reduza o valor da compra.' };
    }

    // Se o valor for abaixo do limite, o pagamento é aprovado.
    return { success: true, message: 'Pagamento aprovado com sucesso!' };
  }
}