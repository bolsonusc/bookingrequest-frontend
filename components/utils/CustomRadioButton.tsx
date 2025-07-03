
export default function CustomRadio ({ name, value, checked, onChange, id }) {
  return (
    <label className="relative flex items-center cursor-pointer">
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="peer hidden"
        id={id}
      />
      <div className="w-5 h-5 rounded-full border-2 border-blue-900 flex items-center justify-center transition-colors duration-300">
        {checked && <div className="w-2.5 h-2.5 rounded-full bg-blue-900 opacity-100 peer-checked:opacity-100"></div>}
      </div>
    </label>
  );
}