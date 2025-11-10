import * as Haptics from 'expo-haptics';
import { Audio } from 'expo-av';

class SoundService {
  private sounds: { [key: string]: Audio.Sound } = {};
  private enabled: boolean = true;
  private volume: number = 0.7;

  async initialize() {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
    });
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  setVolume(volume: number) {
    this.volume = volume;
  }

  async playSound(type: 'shuffle' | 'deal' | 'flip' | 'place' | 'win' | 'bet' | 'chip') {
    if (!this.enabled) return;

    try {
      // Для демо используем системные звуки или генерируем программно
      // В реальном проекте загрузите аудиофайлы
      
      // Простая генерация звука через Web Audio API (для web)
      // Для нативных платформ лучше использовать готовые файлы
      
      switch (type) {
        case 'shuffle':
          await this.playTone(200, 150);
          break;
        case 'deal':
          await this.playTone(600, 80);
          break;
        case 'flip':
          await this.playTone(800, 100);
          break;
        case 'place':
          await this.playTone(400, 120);
          break;
        case 'win':
          await this.playTone(1200, 300);
          break;
        case 'bet':
          await this.playTone(500, 150);
          break;
        case 'chip':
          await this.playTone(450, 100);
          break;
      }
    } catch (error) {
      console.error('Sound play error:', error);
    }
  }

  private async playTone(frequency: number, duration: number) {
    // В продакшене загрузите реальные звуковые файлы из assets
    // Это заглушка для демонстрации
    console.log(`Playing tone: ${frequency}Hz for ${duration}ms`);
  }

  vibrate(pattern: 'light' | 'medium' | 'heavy' | 'success' | 'error' = 'light') {
    try {
      switch (pattern) {
        case 'light':
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          break;
        case 'medium':
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          break;
        case 'heavy':
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          break;
        case 'success':
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          break;
        case 'error':
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          break;
      }
    } catch (error) {
      console.error('Haptics error:', error);
    }
  }
}

export default new SoundService();
