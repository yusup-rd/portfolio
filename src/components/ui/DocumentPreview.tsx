import { getCachedDocument } from "../../utils/documentCache";
import DocumentSkeleton from "../Skeletons/DocumentSkeleton";

interface DocumentPreviewProps {
    src: string;
    page?: number;
}

const DocumentPreview = ({ src, page = 1 }: DocumentPreviewProps) => {
    const cached = getCachedDocument(src);
    return cached?.preview && page === 1 ? (
        <img
            src={cached.preview.url}
            alt=""
            aria-hidden="true"
            width={cached.preview.width}
            height={cached.preview.height}
            className="h-auto w-full"
        />
    ) : (
        <DocumentSkeleton aspectRatio={cached?.aspectRatio} />
    );
};

export default DocumentPreview;
