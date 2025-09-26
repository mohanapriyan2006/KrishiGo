// utils/format.js
import { useTranslation } from "react-i18next";

export const useLocalizedFormat = () => {
	const { i18n } = useTranslation();

	const formatNumber = (number) => {
		// Handle different number formats per language if needed
		return new Intl.NumberFormat(i18n.language).format(number);
	};

	const formatDate = (date) => {
		// Handle different date formats
		return new Date(date).toLocaleDateString(i18n.language);
	};

	return { formatNumber, formatDate };
};
