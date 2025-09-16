import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const RoundProgress = ({
    progress = 0, // 0 to 100
    size = 120,
    strokeWidth = 12,
    backgroundColor = '#e5e7eb', // gray-200
    progressColor = '#65a30d', // green-600
    textColor = '#1f2937', // gray-800
    showPercentage = true,
    duration = 1000,
    children,
    className = '',
}) => {
    const animatedValue = useRef(new Animated.Value(0)).current;
    const circleRef = useRef();

    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;

    useEffect(() => {
        const animation = Animated.timing(animatedValue, {
            toValue: progress,
            duration,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: false,
        });

        animation.start();

        // Animate stroke dash offset
        const listener = animatedValue.addListener(({ value }) => {
            if (circleRef.current) {
                const strokeDashoffset = circumference - (circumference * value) / 100;
                circleRef.current.setNativeProps({
                    strokeDashoffset,
                });
            }
        });

        return () => {
            animatedValue.removeListener(listener);
        };
    }, [progress, circumference]);

    return (
        <View className={`items-center justify-center ${className}`}>
            <View style={{ width: size, height: size }}>
                <Svg
                    width={size}
                    height={size}
                    className="absolute"
                    style={{ transform: [{ rotate: '-90deg' }] }}
                >
                    {/* Background Circle */}
                    <Circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke={backgroundColor}
                        strokeWidth={strokeWidth}
                        fill="transparent"
                    />

                    {/* Progress Circle */}
                    <AnimatedCircle
                        ref={circleRef}
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke={progressColor}
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={circumference}
                    />
                </Svg>

                {/* Center Content */}
                <View className="absolute inset-0 items-center justify-center">
                    {children || (
                        showPercentage && (
                            <Animated.Text
                                className="text-2xl font-bold"
                                style={{
                                    color: textColor,
                                    opacity: animatedValue.interpolate({
                                        inputRange: [0, 100],
                                        outputRange: [0.5, 1],
                                    })
                                }}
                            >
                                {progress < 10 ? '0' : ''}{progress}%
                            </Animated.Text>
                        )
                    )}
                </View>
            </View>
        </View>
    );
};

// // Example usage component
const ProgressExample = () => {
    const [progress, setProgress] = React.useState(0);

    React.useEffect(() => {
        const timer = setTimeout(() => setProgress(60), 500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <View className="flex-1 bg-gray-50 items-center justify-center p-8">
            <Text className="text-2xl font-bold text-gray-800 mb-8">
                Progress Demo
            </Text>

            {/* Default Progress */}
            <View className="mb-8">
                <RoundProgress
                    progress={progress}
                    size={120}
                    className="mb-2"
                />
                <Text className="text-center text-gray-600">Default Style</Text>
            </View>

            {/* Custom Colors */}
            <View className="mb-8">
                <RoundProgress
                    progress={progress}
                    size={100}
                    progressColor="#ef4444" // red-500
                    backgroundColor="#fee2e2" // red-100
                    textColor="#dc2626" // red-600
                    className="mb-2"
                />
                <Text className="text-center text-gray-600">Red Theme</Text>
            </View>

            {/* Large with Custom Content */}
            <View className="mb-8">
                <RoundProgress
                    progress={progress}
                    size={150}
                    strokeWidth={16}
                    progressColor="#8b5cf6" // violet-500
                    backgroundColor="#ede9fe" // violet-100
                    showPercentage={false}
                    className="mb-2"
                >
                    <View className="items-center">
                        <Text className="text-3xl font-bold text-violet-600">
                            {progress}%
                        </Text>
                        <Text className="text-sm text-violet-400">Complete</Text>
                    </View>
                </RoundProgress>
                <Text className="text-center text-gray-600">Custom Content</Text>
            </View>

            {/* Small Progress */}
            <View className="flex-row space-x-4">
                <RoundProgress
                    progress={75}
                    size={80}
                    strokeWidth={8}
                    progressColor="#10b981" // emerald-500
                    duration={1500}
                />
                <RoundProgress
                    progress={45}
                    size={80}
                    strokeWidth={8}
                    progressColor="#f59e0b" // amber-500
                    duration={1200}
                />
                <RoundProgress
                    progress={90}
                    size={80}
                    strokeWidth={8}
                    progressColor="#06b6d4" // cyan-500
                    duration={800}
                />
            </View>
        </View>
    );
};

export default RoundProgress;
export { ProgressExample };
