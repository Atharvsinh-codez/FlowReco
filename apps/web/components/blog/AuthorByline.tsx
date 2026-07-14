interface AuthorBylineProps {
	authors: string;
}

export function AuthorByline({ authors }: AuthorBylineProps) {
	if (!authors.trim()) {
		return null;
	}

	return (
		<p className="mt-16 border-t border-gray-4 pt-8 text-sm text-gray-10">
			By {authors}
		</p>
	);
}
