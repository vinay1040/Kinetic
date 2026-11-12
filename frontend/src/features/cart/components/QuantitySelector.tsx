type QuantitySelectorProps = {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
};

const QuantitySelector = ({
  quantity,
  onIncrease,
  onDecrease,
}: QuantitySelectorProps) => {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={onDecrease}
        disabled={quantity === 1}
        className="rounded border px-3 py-1 disabled:cursor-not-allowed disabled:opacity-50"
      >
        -
      </button>

      <span className="min-w-5 text-center">{quantity}</span>

      <button onClick={onIncrease} className="rounded border px-3 py-1">
        +
      </button>
    </div>
  );
};

export default QuantitySelector;
