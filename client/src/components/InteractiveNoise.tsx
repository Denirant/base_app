import React, { useEffect, useRef } from 'react';

const ProperWaveNoise = () => {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Настройка размера canvas на полный экран
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    // Функция создания градиента из базового цвета
    const createGradient = (color, ctx, x, y, width, height) => {
      const gradient = ctx.createRadialGradient(
        x, y, 0,
        x, y, Math.max(width, height)
      );
      gradient.addColorStop(0, color);
      gradient.addColorStop(1, 'black');
      return gradient;
    };
    
    // Отслеживание положения мыши
    const handleMouseMove = (e) => {
      mouseRef.current = {
        x: e.clientX,
        y: e.clientY
      };
    };
    
    // Отслеживание касаний для мобильных устройств
    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        mouseRef.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY
        };
        e.preventDefault();
      }
    };
    
    // Устанавливаем начальную позицию мыши в центре
    mouseRef.current = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2
    };
    
    // Добавляем обработчики событий
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    
    resizeCanvas();
    
    // Класс для создания и управления волнами
    class Wave {
      constructor(options) {
        this.amplitude = options.amplitude || 100;
        this.period = options.period || 200;
        this.phase = options.phase || 0;
        this.color = options.color || '#ff7f50';
        this.lineWidth = options.lineWidth || 2;
        this.segments = options.segments || 100;
        this.speed = options.speed || 0.02;
      }
      
      draw(ctx, width, height, time, mouseX, mouseY) {
        ctx.beginPath();
        ctx.lineWidth = this.lineWidth;
        
        // Создаем градиент для красивого визуального эффекта
        const gradient = createGradient(this.color, ctx, mouseX, mouseY, width, height);
        ctx.strokeStyle = gradient;
        ctx.fillStyle = gradient;
        
        const segmentWidth = width / this.segments;
        
        // Началом волны будет верх экрана
        let x = 0;
        let y = 0;
        
        ctx.moveTo(x, y);
        
        // Рисуем кривую для волны
        for (let i = 0; i <= this.segments; i++) {
          x = i * segmentWidth;
          
          // Добавляем влияние положения мыши на волны
          const distX = (x - mouseX) / width;
          const cursorInfluence = Math.exp(-distX * distX * 4) * 50;
          
          // Рассчитываем y-координату для волны с учетом времени и влияния курсора
          y = Math.sin(i / this.period * Math.PI * 2 + time * this.speed + this.phase) * this.amplitude;
          
          // Добавляем влияние мыши - волны искажаются вокруг курсора
          y += cursorInfluence * Math.sin(i / 20 + time * 0.1);
          
          // Добавляем смещение на основе положения Y мыши
          const mouseYInfluence = (mouseY / height - 0.5) * 100;
          y += mouseYInfluence;
          
          // Смещаем волну вниз, чтобы она была видна на экране
          y += height / 2;
          
          ctx.lineTo(x, y);
        }
        
        // Завершаем контур заливкой вниз до нижней части экрана и обратно
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();
        
        // Заливаем волну
        ctx.fill();
        
        // Рисуем контур волны
        ctx.stroke();
      }
    }
    
    // Создаем несколько волн с разными параметрами
    const waves = [
      new Wave({
        amplitude: 80,
        period: 100,
        phase: 0,
        color: '#ff7f50', // Оранжевый
        lineWidth: 3,
        speed: 0.02,
        segments: 100
      }),
      new Wave({
        amplitude: 60,
        period: 120,
        phase: Math.PI / 2,
        color: '#ff5f40', // Более насыщенный оранжевый
        lineWidth: 2,
        speed: 0.03,
        segments: 120
      }),
      new Wave({
        amplitude: 40,
        period: 80,
        phase: Math.PI,
        color: '#ff3f30', // Еще более насыщенный оранжевый/красный
        lineWidth: 1.5,
        speed: 0.015,
        segments: 90
      })
    ];
    
    // Класс для создания частиц для эффекта зернистости
    class Particle {
      constructor(x, y, size, color, speedX, speedY) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
        this.speedX = speedX;
        this.speedY = speedY;
        this.alpha = Math.random() * 0.5 + 0.5;
      }
      
      update(width, height, time) {
        // Обновляем положение частицы
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Заставляем частицу немного колебаться для органичного эффекта
        this.x += Math.sin(time * 0.1 + this.x * 0.01) * 0.5;
        this.y += Math.cos(time * 0.1 + this.y * 0.01) * 0.5;
        
        // Если частица выходит за границы, возвращаем ее на противоположную сторону
        if (this.x > width) this.x = 0;
        if (this.x < 0) this.x = width;
        if (this.y > height) this.y = 0;
        if (this.y < 0) this.y = height;
        
        // Меняем размер частицы со временем для эффекта пульсации
        this.size = (Math.sin(time * 0.2 + this.x * 0.01) + 1) * 2 + 1;
      }
      
      draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }
    
    // Создаем частицы для зернистости
    const particles = [];
    const createParticles = (count, width, height) => {
      for (let i = 0; i < count; i++) {
        particles.push(new Particle(
          Math.random() * width,
          Math.random() * height,
          Math.random() * 2 + 1,
          `rgba(255, ${Math.floor(Math.random() * 100 + 80)}, 50, 0.5)`, // Оранжевые оттенки
          (Math.random() - 0.5) * 0.5,
          (Math.random() - 0.5) * 0.5
        ));
      }
    };
    
    // Создаем начальные частицы
    createParticles(200, canvas.width, canvas.height);
    
    // Счетчик времени для анимации
    let time = 0;
    
    // Основной цикл анимации
    const animate = () => {
      const { width, height } = canvas;
      
      // Очищаем canvas
      ctx.clearRect(0, 0, width, height);
      
      // Устанавливаем черный фон
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, width, height);
      
      // Увеличиваем время
      time += 0.05;
      
      // Получаем координаты мыши
      const { x: mouseX, y: mouseY } = mouseRef.current;
      
      // Рисуем все волны
      waves.forEach(wave => {
        wave.draw(ctx, width, height, time, mouseX, mouseY);
      });
      
      // Применяем размытие для более мягкого эффекта
      ctx.filter = 'blur(8px)';
      ctx.globalAlpha = 0.6;
      ctx.drawImage(canvas, 0, 0);
      ctx.filter = 'none';
      ctx.globalAlpha = 1.0;
      
      // Обновляем и рисуем частицы
      particles.forEach(particle => {
        particle.update(width, height, time);
        particle.draw(ctx);
      });
      
      // Создаем эффект "темного пятна" вокруг курсора
      const cursorRadius = 200;
      const cursorGradient = ctx.createRadialGradient(
        mouseX, mouseY, 10,
        mouseX, mouseY, cursorRadius
      );
      cursorGradient.addColorStop(0, 'rgba(0, 0, 0, 0.8)');
      cursorGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      
      ctx.fillStyle = cursorGradient;
      ctx.beginPath();
      ctx.arc(mouseX, mouseY, cursorRadius, 0, Math.PI * 2);
      ctx.fill();
      
      // Запрашиваем следующий кадр
      animationRef.current = requestAnimationFrame(animate);
    };
    
    // Запускаем анимацию
    animate();
    
    // Очистка при размонтировании
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);
  
  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        display: 'block',
        backgroundColor: 'black',
        touchAction: 'none',
        zIndex: -1
      }}
    />
  );
};

export default ProperWaveNoise;